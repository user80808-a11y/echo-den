import { useState, useEffect } from "react";
import SleepAssessment from "./SleepAssessment";
import MorningQuestionnaire, { type MorningQuestionnaireData } from "./MorningQuestionnaire";
import { AssessmentResultsPage } from "./AssessmentResultsPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import { LunaOnboarding } from "./LunaOnboarding";
import { SchedulePreview } from "./SchedulePreview";
import { MorningRoutinePreview } from "./MorningRoutinePreview";
import { useAuth } from "@/contexts/AuthContext";
import { saveSleepSchedule, saveMorningRoutine } from "@/lib/firebaseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  category: "evening" | "night" | "morning";
  icon: React.ReactNode;
}

interface RoutineItem {
  time: string;
  activity: string;
  description: string;
  category: "preparation" | "wellness" | "productivity" | "energy";
  icon: React.ReactNode;
}

interface CombinedAssessmentFlowProps {
  startingAssessment: "sleep" | "morning";
  onComplete?: () => void;
}

type FlowStep =
  | "force-signin"
  | "sleep-questionnaire"
  | "morning-questionnaire"
  | "assessment-results"
  | "subscription"
  | "luna-onboarding"
  | "generating-schedules"
  | "schedules-ready";

export function CombinedAssessmentFlow({
  startingAssessment,
  onComplete,
}: CombinedAssessmentFlowProps) {
  const { user, signIn } = useAuth();
  const [currentStep, setCurrentStep] = useState<FlowStep>(
    user ? 
    (startingAssessment === "sleep"
      ? "sleep-questionnaire"
      : "morning-questionnaire")
    : "force-signin",
  );
  const [sleepData, setSleepData] = useState<any>(null);
  const [morningData, setMorningData] = useState<MorningQuestionnaireData | null>(null);
  const [sleepSchedule, setSleepSchedule] = useState<ScheduleItem[]>([]);
  const [morningRoutine, setMorningRoutine] = useState<RoutineItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Automatically trigger Google sign-in when component loads if user is not authenticated
  useEffect(() => {
    if (!user && currentStep === "force-signin") {
      console.log("[CombinedAssessmentFlow] Triggering Google sign-in...");
      signIn().catch(console.error);
    }
  }, [user, signIn, currentStep]);

  // Update step when user signs in
  useEffect(() => {
    if (user && currentStep === "force-signin") {
      setCurrentStep(
        startingAssessment === "sleep"
          ? "sleep-questionnaire"
          : "morning-questionnaire"
      );
    }
  }, [user, currentStep, startingAssessment]);

  const getActivityIcon = (activity: string, type: "sleep" | "morning") => {
    const activityLower = activity.toLowerCase();
  if (type === "morning") {
      if (
        activityLower.includes("hydration") ||
        activityLower.includes("water")
      )
  return <Icons.Droplets className="h-5 w-5 text-blue-500" />;
      if (
        activityLower.includes("coffee") ||
        activityLower.includes("caffeine")
      )
  return <Icons.Coffee className="h-5 w-5 text-orange-500" />;
      if (
        activityLower.includes("exercise") ||
        activityLower.includes("stretch") ||
        activityLower.includes("movement")
      )
  return <Icons.Dumbbell className="h-5 w-5 text-green-500" />;
      if (
        activityLower.includes("meditation") ||
        activityLower.includes("mindful")
      )
  return <Icons.Brain className="h-5 w-5 text-blue-500" />;
      if (
        activityLower.includes("planning") ||
        activityLower.includes("organize")
      )
  return <Icons.Target className="h-5 w-5 text-blue-600" />;
      if (
        activityLower.includes("breathing") ||
        activityLower.includes("breath")
      )
  return <Icons.Wind className="h-5 w-5 text-cyan-500" />;
      if (activityLower.includes("sunlight") || activityLower.includes("light"))
  return <Icons.Sun className="h-5 w-5 text-yellow-600" />;
      if (activityLower.includes("wake") || activityLower.includes("morning"))
  return <Icons.Sunrise className="h-5 w-5 text-orange-600" />;
    } else {
  if (
        activityLower.includes("coffee") ||
        activityLower.includes("caffeine")
      )
  return <Icons.Coffee className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("screen") || activityLower.includes("phone"))
  return <Icons.Smartphone className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("read") || activityLower.includes("book"))
  return <Icons.Book className="h-5 w-5 text-sleep-primary" />;
      if (
        activityLower.includes("exercise") ||
        activityLower.includes("workout")
      )
  return <Icons.Dumbbell className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("bath") || activityLower.includes("shower"))
  return <Icons.Bath className="h-5 w-5 text-sleep-primary" />;
      if (
        activityLower.includes("music") ||
        activityLower.includes("meditation")
      )
  return <Icons.Music className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("wake") || activityLower.includes("morning"))
  return <Icons.Sun className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("bed") || activityLower.includes("sleep"))
  return <Icons.Bed className="h-5 w-5 text-sleep-primary" />;
      if (activityLower.includes("evening") || activityLower.includes("wind"))
  return <Icons.Moon className="h-5 w-5 text-sleep-primary" />;
    }
  return <Icons.Clock className="h-5 w-5 text-gray-600" />;
  };

  const handleSleepAssessmentComplete = (data: any) => {
    setSleepData(data);
    if (morningData) {
      // Both assessments complete - move to results
      setCurrentStep("assessment-results");
    } else {
      // Move to morning assessment
      setCurrentStep("morning-questionnaire");
    }
  };

  const handleMorningAssessmentComplete = (data: MorningQuestionnaireData) => {
    setMorningData(data);
    if (sleepData) {
      // Both assessments complete - move to results
      setCurrentStep("assessment-results");
    } else {
      // Move to sleep assessment
      setCurrentStep("sleep-questionnaire");
    }
  };

  const handleAssessmentResultsComplete = () => {
    setCurrentStep("subscription");
  };

  const handleSubscriptionComplete = (purchased: boolean) => {
    setHasSubscription(purchased);
    if (purchased) {
      setCurrentStep("luna-onboarding");
    } else {
      // If they didn't purchase, still move to onboarding but with limited features
      setCurrentStep("luna-onboarding");
    }
  };

  const handleLunaOnboardingComplete = () => {
    // Generate the premium routines and move to final dashboard
    if (sleepData && morningData) {
      generateBothSchedules(sleepData, morningData);
    }
  };

  const generateBothSchedules = async (
    sleep: any,
    morning: MorningQuestionnaireData,
  ) => {
    // Prevent multiple simultaneous calls
    if (isGenerating) {
      console.log("Already generating schedules, skipping...");
      return;
    }

    setCurrentStep("generating-schedules");
    setIsGenerating(true);

    try {
      // Generate sleep schedule
      const sleepResponse = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sleep),
      });

      if (!sleepResponse.ok) {
        throw new Error(`Sleep API error: ${sleepResponse.status}`);
      }

      const sleepResult = await sleepResponse.json();

      // Generate morning routine
      const morningResponse = await fetch("/api/generate-morning-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(morning),
      });

      if (!morningResponse.ok) {
        throw new Error(`Morning API error: ${morningResponse.status}`);
      }

      const morningResult = await morningResponse.json();

      // Process sleep schedule
      let scheduleItems: ScheduleItem[] = [];
      if (sleepResult.success && sleepResult.data.schedule) {
        scheduleItems = sleepResult.data.schedule.map((item: any) => ({
          ...item,
          icon: getActivityIcon(item.activity, "sleep"),
        }));
      } else {
        scheduleItems = generateFallbackSleepSchedule(sleep);
      }
      setSleepSchedule(scheduleItems);

      // Process morning routine
      let routineItems: RoutineItem[] = [];
      if (morningResult.success && morningResult.data.routine) {
        routineItems = morningResult.data.routine.map((item: any) => ({
          ...item,
          icon: getActivityIcon(item.activity, "morning"),
        }));
      } else {
        routineItems = generateFallbackMorningRoutine(morning);
      }
      setMorningRoutine(routineItems);

      // Save to Firebase if user is logged in
      if (user) {
        try {
          const now = new Date().toISOString();
          await Promise.all([
            saveSleepSchedule({
              userId: user.id,
              title: `Complete Sleep Schedule - ${new Date().toLocaleDateString()}`,
              schedule: scheduleItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: sleep,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            }),
            saveMorningRoutine({
              userId: user.id,
              title: `Complete Morning Routine - ${new Date().toLocaleDateString()}`,
              routine: routineItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              questionnaireData: morning,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            }),
          ]);
          console.log("Both schedules saved successfully");
        } catch (error) {
          console.error("Error saving schedules:", error);
        }
      }

      setCurrentStep("schedules-ready");
    } catch (error) {
      console.error("Error generating schedules:", error);

      // Check if it's a fetch/network error
      if (
        error instanceof TypeError &&
        error.message.includes("body stream already read")
      ) {
        console.warn("Fetch body stream error - using fallback schedules");
      } else if (
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        console.warn("Network fetch error - using fallback schedules");
      }

      // Use fallback schedules
      setSleepSchedule(generateFallbackSleepSchedule(sleep));
      setMorningRoutine(generateFallbackMorningRoutine(morning));
      setCurrentStep("schedules-ready");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackSleepSchedule = (
    data: any,
  ): ScheduleItem[] => {
  // Use bedtime and wake time from the assessment
  const bedtime = data.bedtime || "22:00";
  const wakeTime = data.wakeTime || "06:30";

        return [
      {
        time: "6:00 PM",
        activity: "Finish daily tasks",
        description:
          "Complete work and daily responsibilities to create mental separation",
        category: "evening",
        icon: <Icons.Clock className="h-5 w-5 text-sleep-primary" />,
      },
      {
        time: bedtime,
        activity: "Bedtime preparation",
        description:
          "Begin your personalized wind-down routine for optimal sleep",
        category: "night",
        icon: <Icons.Bed className="h-5 w-5 text-sleep-primary" />,
      },
      {
        time: wakeTime,
        activity: "Wake up naturally",
        description:
          "Wake up at your desired time feeling refreshed and energized",
        category: "morning",
        icon: <Icons.Sun className="h-5 w-5 text-sleep-primary" />,
      },
    ];
  };

  const generateFallbackMorningRoutine = (
    data: MorningQuestionnaireData,
  ): RoutineItem[] => {
    // Use desired wake time instead of current
    const wakeTime = data.desiredWakeUpTime || data.currentWakeUpTime || "6:30";

    return [
      {
        time: wakeTime,
        activity: "Gentle awakening",
        description:
          "Wake up naturally and set a positive intention for your day",
        category: "preparation",
        icon: <Icons.Sunrise className="h-5 w-5 text-orange-600" />,
      },
      {
        time: "7:00 AM",
        activity: "Morning hydration",
        description: "Drink water to rehydrate your body after sleep",
        category: "wellness",
        icon: <Icons.Droplets className="h-5 w-5 text-blue-500" />,
      },
      {
        time: "7:15 AM",
        activity: "Energizing movement",
        description:
          "Light stretching or gentle exercise to activate your body",
        category: "energy",
        icon: <Icons.Activity className="h-5 w-5 text-green-500" />,
      },
    ];
  };

  const renderProgressStep = () => {
    // Only show progress if user is signed in and past the sign-in step
    if (!user || currentStep === "force-signin") {
      return null;
    }

    const steps = [
      { key: "sleep", label: "Sleep Assessment", completed: !!sleepData },
      { key: "morning", label: "Morning Assessment", completed: !!morningData },
      { 
        key: "results", 
        label: "Results Analysis", 
        completed: currentStep !== "sleep-questionnaire" && currentStep !== "morning-questionnaire" && currentStep !== "assessment-results"
      },
      {
        key: "subscription",
        label: "Premium Unlock",
        completed: currentStep === "luna-onboarding" || currentStep === "generating-schedules" || currentStep === "schedules-ready"
      },
      {
        key: "schedules",
        label: "Your AI Routine",
        completed: currentStep === "schedules-ready",
      },
    ];

    return (
      <div className="flex items-center justify-center mb-8 overflow-x-auto">
        <div className="flex items-center space-x-2 min-w-max">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  step.completed
                    ? "bg-green-500 text-white"
                    : currentStep.includes(step.key.toLowerCase()) || 
                      (step.key === "results" && currentStep === "assessment-results") ||
                      (step.key === "subscription" && currentStep === "subscription")
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.completed ? (
                  <Icons.CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium hidden sm:block ${
                  step.completed ? "text-green-600" : "text-gray-600"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <Icons.ArrowRight className="h-4 w-4 text-gray-400 mx-2 sm:mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (currentStep === "force-signin") {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center p-12">
          <CardContent>
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Opening Google Sign-In...
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Please complete the Google sign-in to create your personalized sleep assessment.
            </p>
            <p className="text-sm text-gray-500">
              If the sign-in window doesn't appear, please click below:
            </p>
            <Button
              onClick={() => signIn()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold mt-4"
              size="lg"
            >
              <Icons.LogIn className="h-5 w-5 mr-2" />
              Sign In with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "sleep-questionnaire") {
    return (
      <div className="space-y-6">
        {renderProgressStep()}
        <SleepAssessment onComplete={handleSleepAssessmentComplete} />
      </div>
    );
  }

  if (currentStep === "morning-questionnaire") {
    return (
      <div className="space-y-6">
        {renderProgressStep()}
        <MorningQuestionnaire onComplete={handleMorningAssessmentComplete} />
      </div>
    );
  }

  if (currentStep === "assessment-results") {
    return (
      <AssessmentResultsPage
        assessmentData={sleepData!}
        onContinueToSubscription={handleAssessmentResultsComplete}
      />
    );
  }

  if (currentStep === "subscription") {
    // Calculate a basic sleep score from the data
    const sleepScore = sleepData ? 45 : 50; // Basic calculation
    const estimatedSavings = 2400; // Annual savings from better sleep

    return (
      <SubscriptionPage
        onBack={() => setCurrentStep("assessment-results")}
        onSuccess={() => handleSubscriptionComplete(true)}
        showBackButton={true}
      />
    );
  }

  if (currentStep === "luna-onboarding") {
    const userName = user?.name || user?.email?.split('@')[0] || "there";
    const userRoutine = { sleepSchedule, morningRoutine };

    return (
      <LunaOnboarding
        userName={userName}
        userRoutine={userRoutine}
        onComplete={handleLunaOnboardingComplete}
      />
    );
  }  if (currentStep === "generating-schedules") {
    return (
      <div className="max-w-2xl mx-auto">
        {renderProgressStep()}
        <Card className="text-center p-12">
          <CardContent>
            <div className="animate-spin h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Creating Your Complete Daily Routine! 🎯
            </h2>
            <p className="text-gray-600 text-lg">
              Luna is combining your sleep and morning preferences to create
              your perfect daily schedule...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "schedules-ready") {
    return (
      <div className="space-y-8">
        {renderProgressStep()}

        {/* Premium Success Message */}
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icons.Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              🎉 Your Premium AI Routine is Ready!
            </h2>
            <p className="text-gray-700 text-lg mb-4">
              Luna has crafted your personalized daily routine using advanced AI analysis of your sleep patterns and morning preferences.
            </p>
            {hasSubscription && (
              <Badge className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg px-6 py-2">
                <Icons.Crown className="h-5 w-5 mr-2" />
                Premium Subscriber
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Premium Routine Display */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl text-gray-900 flex items-center justify-center gap-3">
              <Icons.Brain className="h-8 w-8 text-blue-600" />
              Your AI-Powered Daily Routine
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Scientifically optimized for your chronotype and lifestyle goals
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Sleep Schedule */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-3">
                <Icons.Moon className="h-6 w-6 text-blue-600" />
                Evening & Sleep Schedule
              </h3>
              <SchedulePreview schedule={sleepSchedule} isGenerating={false} />
            </div>

            {/* Morning Routine */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center flex items-center justify-center gap-3">
                <Icons.Sunrise className="h-6 w-6 text-orange-600" />
                Morning Optimization Routine
              </h3>
              <MorningRoutinePreview
                routine={morningRoutine}
                isGenerating={false}
              />
            </div>

            {/* Premium Features Highlight */}
            {hasSubscription && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-6 text-center">
                <h4 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                  <Icons.Zap className="h-6 w-6" />
                  Premium Features Active
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4" />
                    AI Schedule Optimization
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4" />
                    Personalized Coaching
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Check className="h-4 w-4" />
                    Progress Tracking
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {onComplete && (
          <div className="text-center mt-12">
            <Button
              onClick={onComplete}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-12 py-4 text-xl font-bold shadow-lg"
              size="lg"
            >
              <Icons.ArrowRight className="h-6 w-6 mr-2" />
              Enter Your Premium Dashboard
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
