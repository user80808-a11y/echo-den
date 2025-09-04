import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Clock, Brain, Star, AlertTriangle, Phone, Target, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

type Question = {
  id: string;
  title: string;
  subtitle?: string;
  type: "time" | "single" | "multi" | "text";
  options?: { value: string; label: string; icon?: React.ReactNode }[];
  hint?: string;
  icon?: React.ReactNode;
  color?: string;
};

const questions: Question[] = [
  {
    id: "bedtime",
    title: "When do you usually fall asleep?",
    subtitle: "Your natural bedtime schedule",
    type: "time",
    hint: "Be honest about your actual bedtime, not your ideal",
    icon: <Moon className="w-6 h-6" />,
    color: "from-purple-600 to-blue-600"
  },
  {
    id: "wakeTime", 
    title: "What time do you naturally wake up?",
    subtitle: "Without alarms or external pressure",
    type: "time",
    hint: "Think weekends or days off - when you wake up naturally",
    icon: <Clock className="w-6 h-6" />,
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: "sleepDuration",
    title: "How many hours do you actually sleep?",
    subtitle: "Your typical sleep duration",
    type: "single",
    options: [
      { value: "<5", label: "Less than 5 hours", icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
      { value: "5-6", label: "5-6 hours", icon: <Clock className="w-4 h-4 text-orange-500" /> },
      { value: "6-7", label: "6-7 hours", icon: <Clock className="w-4 h-4 text-yellow-500" /> },
      { value: "7-8", label: "7-8 hours", icon: <Star className="w-4 h-4 text-green-500" /> },
      { value: ">8", label: "More than 8 hours", icon: <Star className="w-4 h-4 text-blue-500" /> },
    ],
    hint: "Be realistic - this affects everything we build for you",
    icon: <Brain className="w-6 h-6" />,
    color: "from-green-500 to-teal-500"
  },
  {
    id: "sleepQuality",
    title: "How do you feel when you wake up?",
    subtitle: "Your morning energy and alertness",
    type: "single",
    options: [
      { value: "exhausted", label: "Exhausted and groggy", icon: <AlertTriangle className="w-4 h-4 text-red-500" /> },
      { value: "tired", label: "Tired but functional", icon: <Clock className="w-4 h-4 text-orange-500" /> },
      { value: "okay", label: "Okay, need coffee", icon: <Clock className="w-4 h-4 text-yellow-500" /> },
      { value: "refreshed", label: "Refreshed and alert", icon: <Star className="w-4 h-4 text-green-500" /> },
      { value: "energized", label: "Energized and ready", icon: <Sparkles className="w-4 h-4 text-blue-500" /> },
    ],
    hint: "How you feel most mornings, not just your best days",
    icon: <Star className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "challenges",
    title: "What's sabotaging your sleep?",
    subtitle: "The biggest barriers to great sleep",
    type: "multi",
    options: [
      { value: "falling-asleep", label: "Can't fall asleep", icon: <Moon className="w-4 h-4" /> },
      { value: "staying-asleep", label: "Wake up during the night", icon: <Clock className="w-4 h-4" /> },
      { value: "waking-early", label: "Wake up too early", icon: <Clock className="w-4 h-4" /> },
      { value: "racing-thoughts", label: "Racing mind", icon: <Brain className="w-4 h-4" /> },
      { value: "noise-light", label: "Noise or light", icon: <AlertTriangle className="w-4 h-4" /> },
      { value: "stress-anxiety", label: "Stress and anxiety", icon: <AlertTriangle className="w-4 h-4" /> },
      { value: "schedule", label: "Inconsistent schedule", icon: <Clock className="w-4 h-4" /> },
      { value: "environment", label: "Poor sleep environment", icon: <Moon className="w-4 h-4" /> },
    ],
    hint: "Select all that apply - we'll address each one",
    icon: <AlertTriangle className="w-6 h-6" />,
    color: "from-red-500 to-orange-500"
  },
  {
    id: "habits",
    title: "What do you do before bed?",
    subtitle: "Your current pre-sleep routine",
    type: "multi",
    options: [
      { value: "phone-social", label: "Scroll phone/social media", icon: <Phone className="w-4 h-4" /> },
      { value: "tv-streaming", label: "Watch TV/Netflix", icon: <Phone className="w-4 h-4" /> },
      { value: "work-email", label: "Work or check emails", icon: <Phone className="w-4 h-4" /> },
      { value: "caffeine", label: "Drink caffeine", icon: <AlertTriangle className="w-4 h-4" /> },
      { value: "alcohol", label: "Have alcohol", icon: <AlertTriangle className="w-4 h-4" /> },
      { value: "exercise", label: "Exercise intensely", icon: <AlertTriangle className="w-4 h-4" /> },
      { value: "reading", label: "Read books", icon: <Star className="w-4 h-4" /> },
      { value: "meditation", label: "Meditate or relax", icon: <Star className="w-4 h-4" /> },
    ],
    hint: "Honest answers help us build better routines",
    icon: <Phone className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "goal",
    title: "What's your #1 sleep goal?",
    subtitle: "What success looks like for you",
    type: "text",
    hint: "e.g., 'Fall asleep in 10 minutes' or 'Wake up feeling energized'",
    icon: <Target className="w-6 h-6" />,
    color: "from-blue-500 to-purple-500"
  },
];

type SleepAssessmentProps = {
  onComplete: (data: any) => void;
};

const SleepAssessment: React.FC<SleepAssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isAnimating, setIsAnimating] = useState(false);
  
  const q = questions[step];
  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleInput = (id: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [id]: value }));
  };

  const canProceed = () => {
    if (q.type === "multi") return Array.isArray(answers[q.id]) && answers[q.id].length > 0;
    return !!answers[q.id];
  };

  const handleContinue = () => {
    if (!canProceed()) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        onComplete(answers);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (step > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep(step - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Sleep Assessment</h1>
              <p className="text-purple-200">Discover your sleep potential</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-white/70 text-sm">
              <span>Question {step + 1} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className={`bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <CardHeader className="text-center pb-6">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${q.color || 'from-purple-500 to-blue-500'} shadow-lg mb-4`}>
              {q.icon || <Moon className="w-6 h-6 text-white" />}
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-2">
              {q.title}
            </CardTitle>
            {q.subtitle && (
              <p className="text-white/60 text-lg">{q.subtitle}</p>
            )}
            {q.hint && (
              <p className="text-purple-200 text-sm mt-3 bg-white/5 rounded-lg px-4 py-2">
                💡 {q.hint}
              </p>
            )}
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            {/* Time Input */}
            {q.type === "time" && (
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    id={q.id}
                    type="time"
                    value={answers[q.id] || ""}
                    onChange={e => handleInput(q.id, e.target.value)}
                    className="h-16 text-xl text-center bg-white/10 border-white/20 text-white rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/40"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            )}

            {/* Text Input */}
            {q.type === "text" && (
              <div className="space-y-4">
                <Input
                  id={q.id}
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={e => handleInput(q.id, e.target.value)}
                  placeholder="Type your answer here..."
                  className="h-16 text-lg bg-white/10 border-white/20 text-white rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-white/40"
                />
              </div>
            )}

            {/* Single Choice */}
            {q.type === "single" && q.options && (
              <div className="grid gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleInput(q.id, opt.value)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                      answers[q.id] === opt.value
                        ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                        : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${answers[q.id] === opt.value ? 'text-purple-300' : 'text-white/60'}`}>
                      {opt.icon}
                    </div>
                    <span className={`font-medium ${answers[q.id] === opt.value ? 'text-white' : 'text-white/80'}`}>
                      {opt.label}
                    </span>
                    <div className={`ml-auto w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      answers[q.id] === opt.value 
                        ? 'border-purple-400 bg-purple-400' 
                        : 'border-white/30'
                    }`}>
                      {answers[q.id] === opt.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Multiple Choice */}
            {q.type === "multi" && q.options && (
              <div className="grid gap-3">
                {q.options.map(opt => {
                  const isSelected = Array.isArray(answers[q.id]) && answers[q.id].includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const currentArray = Array.isArray(answers[q.id]) ? answers[q.id] : [];
                        if (isSelected) {
                          handleInput(q.id, currentArray.filter((v: any) => v !== opt.value));
                        } else {
                          handleInput(q.id, [...currentArray, opt.value]);
                        }
                      }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] ${
                        isSelected
                          ? 'border-purple-400 bg-purple-500/20 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isSelected ? 'text-purple-300' : 'text-white/60'}`}>
                        {opt.icon}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-white' : 'text-white/80'}`}>
                        {opt.label}
                      </span>
                      <div className={`ml-auto w-4 h-4 rounded border-2 flex-shrink-0 ${
                        isSelected 
                          ? 'border-purple-400 bg-purple-400' 
                          : 'border-white/30'
                      }`}>
                        {isSelected && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
              <Button
                onClick={handleBack}
                disabled={step === 0}
                variant="outline"
                className="flex items-center gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-30 px-6 py-3"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              
              <Button
                onClick={handleContinue}
                disabled={!canProceed()}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200"
              >
                {step === questions.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Get My Results
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
};

export default SleepAssessment;
