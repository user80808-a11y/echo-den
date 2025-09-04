import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Initialize Stripe with the provided secret key
const stripe = new Stripe(
  functions.config().stripe.secret_key ||
  process.env.STRIPE_SECRET_KEY ||
  'your_stripe_secret_key_here',
  {
    apiVersion: '2024-04-10',
  }
);

const db = admin.firestore();

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = functions.config().stripe.webhook_secret;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('✅ Webhook signature verified:', event.type);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('❌ Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

/**
 * Handle checkout.session.completed event
 * Mark user as active with their subscription in Firestore
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('💳 Processing checkout.session.completed:', session.id);

  try {
    // Get customer details
    const customerId = session.customer as string;
    const customerEmail = session.customer_email || session.customer_details?.email;

    if (!customerEmail) {
      console.error('❌ No customer email found in checkout session');
      return;
    }

    // Get subscription details if this was a subscription checkout
    let subscriptionTier = 'free';
    let subscriptionStatus = 'active';

    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price.id;
      
      // Map price IDs to subscription tiers
      subscriptionTier = mapPriceIdToTier(priceId);
      subscriptionStatus = subscription.status;

      console.log(`📋 Subscription details: tier=${subscriptionTier}, status=${subscriptionStatus}`);
    }

    // Find user by email and update their subscription
    await updateUserSubscription(customerEmail, customerId, subscriptionTier, subscriptionStatus);

    console.log(`✅ Successfully processed checkout completion for ${customerEmail}`);
  } catch (error) {
    console.error('❌ Error handling checkout.session.completed:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 * Update user's subscription status (active, canceled, past_due)
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('📋 Processing customer.subscription.updated:', subscription.id);

  try {
    // Get customer details
    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted || !customer.email) {
      console.error('❌ Customer not found or has no email');
      return;
    }

    // Get subscription details
    const priceId = subscription.items.data[0]?.price.id;
    const subscriptionTier = mapPriceIdToTier(priceId);
    const subscriptionStatus = subscription.status;

    console.log(`📋 Subscription update: tier=${subscriptionTier}, status=${subscriptionStatus}`);

    // Update user subscription
    await updateUserSubscription(customer.email, customerId, subscriptionTier, subscriptionStatus);

    console.log(`✅ Successfully updated subscription for ${customer.email}`);
  } catch (error) {
    console.error('❌ Error handling customer.subscription.updated:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed event
 * Mark user as inactive in Firestore
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('💸 Processing invoice.payment_failed:', invoice.id);

  try {
    // Get customer details
    const customerId = invoice.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted || !customer.email) {
      console.error('❌ Customer not found or has no email');
      return;
    }

    // Mark user as inactive due to payment failure
    await updateUserSubscription(customer.email, customerId, 'free', 'payment_failed');

    console.log(`✅ Successfully marked ${customer.email} as inactive due to payment failure`);
  } catch (error) {
    console.error('❌ Error handling invoice.payment_failed:', error);
    throw error;
  }
}

/**
 * Update user's subscription in Firestore
 */
async function updateUserSubscription(
  email: string,
  stripeCustomerId: string,
  subscriptionTier: string,
  subscriptionStatus: string,
  additionalData?: { subscriptionId?: string; currentPeriodEnd?: string }
) {
  try {
    // Find user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.warn(`⚠️ No user found with email: ${email}. Creating new user record.`);
      
      // Create new user record if none exists
      await usersRef.add({
        email,
        subscriptionTier,
        subscriptionStatus,
        stripeCustomerId,
        isActive: subscriptionStatus === 'active',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Created new user record for ${email}`);
      return;
    }

    // Update existing user
    const userDoc = snapshot.docs[0];
    const updateData: any = {
      subscriptionTier,
      subscriptionStatus,
      stripeCustomerId,
      isActive: subscriptionStatus === 'active',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add additional data if provided
    if (additionalData?.subscriptionId) {
      updateData.subscriptionId = additionalData.subscriptionId;
    }
    if (additionalData?.currentPeriodEnd) {
      updateData.currentPeriodEnd = additionalData.currentPeriodEnd;
    }

    await userDoc.ref.update(updateData);

    console.log(`✅ Updated subscription for ${email}: tier=${subscriptionTier}, status=${subscriptionStatus}`);
  } catch (error) {
    console.error(`❌ Error updating user subscription for ${email}:`, error);
    throw error;
  }
}

/**
 * Create a new subscription for a customer
 * Called from the frontend checkout flow
 */
export const createSubscription = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { paymentMethodId, priceId, userId, userEmail, planId } = data;

  if (!paymentMethodId || !priceId || !userId || !userEmail || !planId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required parameters');
  }

  try {
    console.log(`💳 Creating subscription for user: ${userEmail}, plan: ${planId}`);

    // Create or get customer
    let customer: Stripe.Customer;

    // First try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      console.log(`📋 Found existing customer: ${customer.id}`);
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId: userId,
        },
      });
      console.log(`✅ Created new customer: ${customer.id}`);
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        userId: userId,
        planId: planId,
      },
    });

    console.log(`📋 Created subscription: ${subscription.id}`);

    // Get payment intent for client confirmation
    const paymentIntent = (subscription.latest_invoice as Stripe.Invoice)?.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent) {
      throw new Error('No payment intent found on subscription');
    }

    // Update user in Firestore immediately
    await updateUserSubscription(userEmail, customer.id, planId, subscription.status, {
      subscriptionId: subscription.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    };

  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    throw new functions.https.HttpsError('internal', `Failed to create subscription: ${error.message}`);
  }
});

/**
 * Create Stripe Billing Portal session for subscription management
 */
export const createBillingPortalSession = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { customerId, returnUrl } = data;

  if (!customerId) {
    throw new functions.https.HttpsError('invalid-argument', 'Customer ID is required');
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || 'https://your-app-domain.com/dashboard',
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('❌ Error creating billing portal session:', error);
    throw new functions.https.HttpsError('internal', `Failed to create billing portal session: ${error.message}`);
  }
});

/**
 * Map Stripe price IDs to subscription tiers
 */
function mapPriceIdToTier(priceId: string | undefined): string {
  const priceMapping: Record<string, string> = {
    // Actual product IDs from Stripe
    'prod_ShOpHstB04WmkP': 'sleep-focused',      // $5.99/month
    'prod_ShOsb0B7Sw7bRm': 'full-transformation', // $9.99/month
    'prod_ShOxiGR7WIhhN5': 'elite-performance',   // $13.99/month
  };

  // Log unknown price IDs for debugging
  if (priceId && !priceMapping[priceId]) {
    console.warn(`⚠️ Unknown price ID: ${priceId}. Please add to mapping.`);
  }

  return priceMapping[priceId || ''] || 'sleep-focused';
}
