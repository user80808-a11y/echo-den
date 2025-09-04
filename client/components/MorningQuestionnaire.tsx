import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Target,
  Dumbbell,
  Coffee,
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';

export interface MorningQuestionnaireData {
  currentWakeUpTime: string;
  desiredWakeUpTime: string;
  morningGoal: string;
  availableTime: string;
  morningEnergyLevel: string;
  motivationStyle: string;
  morningMood: string;
  currentMorningActivities: string[];
  exercisePreference: string;
  caffeineHabits: string;
  workStartTime: string;
  morningCommute: string;
  weekendDifference: string;
  morningChallenges: string[];
  productivityGoals: string[];
  wellnessGoals: string[];
  morningEnvironment: string;
  seasonalPreferences: string;
  additionalInfo: string;
}

interface MorningQuestionnaireProps {
  onComplete: (data: MorningQuestionnaireData) => void;
}

interface Question {
  id: string;
  title: string;
  subtitle?: string;
  hint?: string;
  type: "single" | "multi" | "time" | "text";
  icon: React.ReactNode;
  color: string;
  options?: {
    value: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const questions: Question[] = [
  {
    id: "currentWakeUpTime",
    title: "What time do you currently wake up?",
    subtitle: "Let's understand your current routine",
    type: "time",
    icon: <Clock className="w-6 h-6" />,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "desiredWakeUpTime", 
    title: "What time would you like to wake up?",
    subtitle: "Your ideal wake-up time",
    type: "time",
    icon: <Target className="w-6 h-6" />,
    color: "from-green-500 to-emerald-600"
  },
  {
    id: "morningGoal",
    title: "What's your main morning goal?",
    subtitle: "What do you want to achieve in your morning routine?",
    type: "single",
    icon: <Target className="w-6 h-6" />,
    color: "from-purple-500 to-violet-600",
    options: [
      {
        value: "energy",
        label: "Boost energy and alertness",
        icon: <Zap className="w-5 h-5 text-yellow-400" />
      },
      {
        value: "productivity",
        label: "Increase daily productivity",
        icon: <Target className="w-5 h-5 text-blue-400" />
      },
      {
        value: "wellness",
        label: "Improve overall wellness",
        icon: <Sun className="w-5 h-5 text-orange-400" />
      },
      {
        value: "consistency",
        label: "Build consistent habits",
        icon: <Clock className="w-5 h-5 text-green-400" />
      }
    ]
  },
  {
    id: "availableTime",
    title: "How much time do you have for your morning routine?",
    subtitle: "From wake-up to when you need to start work/other commitments",
    type: "single",
    icon: <Clock className="w-6 h-6" />,
    color: "from-orange-500 to-red-600",
    options: [
      {
        value: "15-30min",
        label: "15-30 minutes",
        icon: <Clock className="w-5 h-5 text-red-400" />
      },
      {
        value: "30-60min",
        label: "30-60 minutes",
        icon: <Clock className="w-5 h-5 text-orange-400" />
      },
      {
        value: "1-2hours",
        label: "1-2 hours",
        icon: <Clock className="w-5 h-5 text-green-400" />
      },
      {
        value: "2+hours",
        label: "2+ hours",
        icon: <Clock className="w-5 h-5 text-blue-400" />
      }
    ]
  },
  {
    id: "exercisePreference",
    title: "What type of morning movement appeals to you?",
    subtitle: "Choose what feels right for your body and lifestyle",
    type: "single",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-600",
    options: [
      {
        value: "none",
        label: "No exercise in the morning",
        icon: <Sun className="w-5 h-5 text-gray-400" />
      },
      {
        value: "light-stretch",
        label: "Light stretching or yoga",
        icon: <Sun className="w-5 h-5 text-purple-400" />
      },
      {
        value: "cardio",
        label: "Cardio workout",
        icon: <Zap className="w-5 h-5 text-red-400" />
      },
      {
        value: "strength",
        label: "Strength training",
        icon: <Dumbbell className="w-5 h-5 text-blue-400" />
      },
      {
        value: "walk",
        label: "Morning walk",
        icon: <Sun className="w-5 h-5 text-green-400" />
      }
    ]
  },
  {
    id: "caffeineHabits",
    title: "What's your relationship with morning caffeine?",
    subtitle: "Understanding your caffeine needs",
    type: "single",
    icon: <Coffee className="w-6 h-6" />,
    color: "from-amber-500 to-orange-600",
    options: [
      {
        value: "none",
        label: "I don't drink caffeine",
        icon: <Sun className="w-5 h-5 text-gray-400" />
      },
      {
        value: "minimal",
        label: "One cup of coffee/tea",
        icon: <Coffee className="w-5 h-5 text-amber-400" />
      },
      {
        value: "moderate",
        label: "2-3 cups throughout morning",
        icon: <Coffee className="w-5 h-5 text-orange-400" />
      },
      {
        value: "heavy",
        label: "Multiple cups, need caffeine to function",
        icon: <Coffee className="w-5 h-5 text-red-400" />
      }
    ]
  },
  {
    id: "morningChallenges",
    title: "What are your biggest morning challenges?",
    subtitle: "Select all that apply - we'll help you overcome these",
    hint: "Choose as many as you experience",
    type: "multi",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "from-red-500 to-pink-600",
    options: [
      {
        value: "waking-up",
        label: "Difficulty waking up/getting out of bed",
        icon: <Clock className="w-5 h-5 text-blue-400" />
      },
      {
        value: "low-energy",
        label: "Low energy in the morning",
        icon: <Zap className="w-5 h-5 text-yellow-400" />
      },
      {
        value: "no-time",
        label: "Never enough time",
        icon: <Clock className="w-5 h-5 text-red-400" />
      },
      {
        value: "inconsistent",
        label: "Inconsistent routine",
        icon: <Target className="w-5 h-5 text-purple-400" />
      },
      {
        value: "motivation",
        label: "Lack of motivation",
        icon: <Sun className="w-5 h-5 text-orange-400" />
      },
      {
        value: "rushing",
        label: "Always rushing/stressed",
        icon: <AlertTriangle className="w-5 h-5 text-red-400" />
      }
    ]
  }
];

export function MorningQuestionnaire({ onComplete }: MorningQuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  const handleAnswer = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleMultiSelect = (value: string) => {
    const current = responses[currentQuestion.id] || [];
    const updated = current.includes(value)
      ? current.filter((item: string) => item !== value)
      : [...current, value];
    handleAnswer(updated);
  };

  const canProceed = () => {
    const answer = responses[currentQuestion.id];
    if (currentQuestion.type === "multi") {
      return answer && answer.length > 0;
    }
    return answer && answer.trim() !== "";
  };

  const handleContinue = () => {
    if (step === questions.length - 1) {
      // Convert responses to proper format
      const morningData: MorningQuestionnaireData = {
        currentWakeUpTime: responses.currentWakeUpTime || "",
        desiredWakeUpTime: responses.desiredWakeUpTime || "",
        morningGoal: responses.morningGoal || "",
        availableTime: responses.availableTime || "",
        morningEnergyLevel: responses.morningEnergyLevel || "",
        motivationStyle: "",
        morningMood: "",
        currentMorningActivities: [],
        exercisePreference: responses.exercisePreference || "",
        caffeineHabits: responses.caffeineHabits || "",
        workStartTime: "",
        morningCommute: "",
        weekendDifference: "",
        morningChallenges: responses.morningChallenges || [],
        productivityGoals: [],
        wellnessGoals: [],
        morningEnvironment: "",
        seasonalPreferences: "",
        additionalInfo: ""
      };
      onComplete(morningData);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium">Morning Assessment</span>
            <div className="text-white/70 text-sm">
              {step + 1} of {questions.length}
            </div>
          </div>
          
          <div className="mt-4 max-w-md mx-auto">
            <Progress value={progress} className="h-2 bg-white/10" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Question Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${currentQuestion.color} mb-4 shadow-lg`}>
                <div className="text-white">
                  {currentQuestion.icon}
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                {currentQuestion.title}
              </h2>
              
              {currentQuestion.subtitle && (
                <p className="text-white/70 text-lg">
                  {currentQuestion.subtitle}
                </p>
              )}
              
              {currentQuestion.hint && (
                <p className="text-white/50 text-sm mt-3 italic">
                  {currentQuestion.hint}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-4 mb-8">
              {currentQuestion.type === "time" && (
                <div className="max-w-xs mx-auto">
                  <Input
                    type="time"
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="bg-white/10 border-white/20 text-white text-center text-lg py-4 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              )}

              {currentQuestion.type === "single" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(option.value)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        responses[currentQuestion.id] === option.value
                          ? "bg-white/20 border-white/40 shadow-lg backdrop-blur-md"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white/10 rounded-lg">
                          {option.icon}
                        </div>
                        <span className="text-white font-medium text-left flex-1">
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === "multi" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = (responses[currentQuestion.id] || []).includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleMultiSelect(option.value)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                          isSelected
                            ? "bg-white/20 border-white/40 shadow-lg backdrop-blur-md"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-white/10 rounded-lg">
                            {option.icon}
                          </div>
                          <span className="text-white font-medium text-left flex-1">
                            {option.label}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <Sparkles className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === "text" && (
                <div className="max-w-md mx-auto">
                  <Input
                    value={responses[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center py-4"
                    placeholder="Type your answer..."
                  />
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handleBack}
                disabled={step === 0}
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {step === questions.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Complete Assessment
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MorningQuestionnaire;
