#!/bin/bash

# SleepVision Subscription System Setup Script
# This script configures Firebase Functions with Stripe credentials

echo "🚀 Setting up SleepVision Subscription System..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed. Please install it first:${NC}"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  You need to login to Firebase first:${NC}"
    echo "firebase login"
    exit 1
fi

echo -e "${GREEN}✅ Firebase CLI detected${NC}"

# Set Firebase Functions configuration
echo -e "${YELLOW}📝 Setting up Stripe configuration in Firebase Functions...${NC}"

# Set Stripe secret key
firebase functions:config:set stripe.secret_key="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"

# Note: You'll need to set this manually in your Stripe dashboard
echo -e "${YELLOW}⚠️  IMPORTANT: Set up your Stripe webhook secret:${NC}"
echo "1. Go to https://dashboard.stripe.com/webhooks"
echo "2. Create a new webhook endpoint with your function URL"
echo "3. Add these events: checkout.session.completed, customer.subscription.updated, invoice.payment_failed"
echo "4. Copy the webhook secret and run:"
echo "   firebase functions:config:set stripe.webhook_secret=\"whsec_your_webhook_secret_here\""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
cd functions
npm install
cd ..

# Set environment variables for frontend
echo -e "${YELLOW}🔧 Setting up frontend environment variables...${NC}"

cat > .env << EOF
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51Rg90uKgz9QnYIntCfLFgTjHBCpcVvIEcUlrPcZN4QD7ASZG2d0s4l0l2S2xU8KFUDDRzlKDUIzJIePWeBNZXWWv00jMW6Rmos

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBkgpVyPyeteAymraqamGCheRKvOIA80i4
VITE_FIREBASE_AUTH_DOMAIN=sleepvision-c0d73.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=sleepvision-c0d73
VITE_FIREBASE_STORAGE_BUCKET=sleepvision-c0d73.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=337763729696
VITE_FIREBASE_APP_ID=1:337763729696:web:d27c344e56b19ee81fd745
VITE_FIREBASE_MEASUREMENT_ID=G-8FJVD1LBNS
EOF

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Build and deploy functions
echo -e "${YELLOW}🔨 Building and deploying Firebase Functions...${NC}"

cd functions
npm run build
cd ..

echo -e "${YELLOW}🚀 Deploying to Firebase...${NC}"
firebase deploy --only functions

echo -e "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Set up your Stripe webhook secret (see instructions above)"
echo "2. Test the subscription flow:"
echo "   - Visit your app"
echo "   - Try the subscription checkout"
echo "   - Verify webhook events in Stripe dashboard"
echo ""
echo -e "${GREEN}💳 Your subscription system is ready!${NC}"
echo ""
echo -e "${YELLOW}🔍 Subscription Plans Configured:${NC}"
echo "• Sleep-Focused: \$5.99/month (prod_ShOpHstB04WmkP)"
echo "• Full Transformation: \$9.99/month (prod_ShOsb0B7Sw7bRm)"
echo "• Elite Performance: \$13.99/month (prod_ShOxiGR7WIhhN5)"
