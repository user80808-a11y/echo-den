import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  ArrowRight, 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Moon,
  Sun,
  Coffee,
  Star
} from "lucide-react";

interface LunaOnboardingProps {
  userName: string;
  userRoutine: any; // The generated routine
  onComplete: () => void;
}

export function LunaOnboarding({ userName, userRoutine, onComplete }: LunaOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const onboardingSteps = [
    {
      id: "welcome",
      title: `Hello ${userName}! I'm Luna 🌙`,
      subtitle: "Your Personal AI Sleep Coach",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Moon className="w-16 h-16 text-white" />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Congratulations on taking the first step toward better sleep! 
              I'm Luna, your AI sleep coach, and I'm here to guide you every step of the way.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">
                ✨ I've analyzed your responses and created a completely personalized routine 
                designed specifically for your chronotype and lifestyle.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "routine-preview",
      title: "Your Personalized Sleep Routine",
      subtitle: "Built just for you by AI",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium mb-4">
              <Star className="w-4 h-4" />
              Your Premium Routine is Ready!
            </div>
          </div>
          
          <div className="grid gap-4">
            {/* Evening Routine */}
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Moon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Evening Wind-Down</h3>
                    <p className="text-gray-600">Optimize for your chronotype</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>9:00 PM - Start wind-down routine</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>10:30 PM - Optimal bedtime for your chronotype</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Morning Routine */}
            <Card className="border-2 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Sun className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Morning Energizer</h3>
                    <p className="text-gray-600">Start your day right</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>6:30 AM - Natural wake time</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Coffee className="w-4 h-4 text-gray-500" />
                    <span>7:00 AM - Optimal coffee timing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="text-center">
              <Sparkles className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-bold text-green-800 mb-2">AI-Powered Personalization</h4>
              <p className="text-green-700 text-sm">
                This routine is specifically designed for your chronotype, lifestyle, and goals. 
                It will adapt as you use it and provide better results over time.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "dashboard-tour",
      title: "Let me show you around",
      subtitle: "Your new sleep optimization dashboard",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h4 className="font-medium">Daily Tracking</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Log your sleep and get personalized insights every day
                </p>
              </CardContent>
            </Card>

            <Card className="border border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h4 className="font-medium">Progress Analytics</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Watch your sleep quality improve with detailed charts
                </p>
              </CardContent>
            </Card>

            <Card className="border border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h4 className="font-medium">AI Recommendations</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Get personalized tips and routine adjustments from me
                </p>
              </CardContent>
            </Card>

            <Card className="border border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                  <h4 className="font-medium">Premium Features</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Access to advanced analytics and coaching features
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <Moon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-800 mb-2">💡 Pro Tip from Luna</h4>
                <p className="text-blue-700 text-sm">
                  The first week is crucial! I'll be sending you daily reminders and tips 
                  to help you stick to your new routine. Trust the process - most users 
                  see improvements within 3-7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ready",
      title: "You're all set! 🎉",
      subtitle: "Ready to transform your sleep?",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Star className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">
              Your sleep transformation starts now!
            </h3>
            <p className="text-lg text-gray-600">
              I'll be with you every step of the way. Let's head to your dashboard 
              and start with tonight's routine.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">7 Days</div>
                <div className="text-sm text-gray-600">To see results</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">90%</div>
                <div className="text-sm text-gray-600">Success rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600">AI coaching</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              🔔 I'll send you a reminder tonight at 9:00 PM to start your wind-down routine
            </p>
            <p className="text-sm text-gray-500">
              📱 Check your dashboard tomorrow morning to log your first night's sleep
            </p>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = onboardingSteps[currentStep];

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white shadow-2xl border-0">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-blue-600">
                Step {currentStep + 1} of {onboardingSteps.length}
              </span>
              <Badge className="bg-purple-100 text-purple-800">
                AI Onboarding
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentStepData.title}
              </h1>
              <p className="text-xl text-gray-600">
                {currentStepData.subtitle}
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {currentStepData.content}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3"
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-medium"
            >
              {currentStep === onboardingSteps.length - 1 ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LunaOnboarding;
