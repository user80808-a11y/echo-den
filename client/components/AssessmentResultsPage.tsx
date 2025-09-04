import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Heart,
  TrendingDown,
  DollarSign,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  Moon,
  Coffee,
  Eye
} from "lucide-react";

interface AssessmentData {
  bedtime?: string;
  wakeTime?: string;
  sleepDuration?: string;
  sleepQuality?: string;
  challenges?: string[];
  habits?: string[];
  goal?: string;
}

interface AssessmentResultsPageProps {
  assessmentData: AssessmentData;
  onContinueToSubscription: () => void;
}

export function AssessmentResultsPage({ 
  assessmentData, 
  onContinueToSubscription 
}: AssessmentResultsPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showScore, setShowScore] = useState(false);

  // Simulate analysis loading
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
    
    const timer2 = setTimeout(() => {
      setShowScore(true);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Calculate sleep quality score based on assessment data
  const calculateSleepScore = () => {
    let score = 100;
    
    // Reduce score based on sleep quality
    if (assessmentData.sleepQuality === "exhausted") score -= 40;
    else if (assessmentData.sleepQuality === "tired") score -= 30;
    else if (assessmentData.sleepQuality === "okay") score -= 20;
    else if (assessmentData.sleepQuality === "refreshed") score -= 5;
    
    // Reduce score based on sleep duration
    if (assessmentData.sleepDuration === "<5") score -= 35;
    else if (assessmentData.sleepDuration === "5-6") score -= 25;
    else if (assessmentData.sleepDuration === "6-7") score -= 10;
    
    // Reduce score for challenges
    const challenges = assessmentData.challenges || [];
    score -= challenges.length * 8;
    
    // Reduce score for bad habits
    const badHabits = (assessmentData.habits || []).filter(habit => 
      ['phone-social', 'tv-streaming', 'work-email', 'caffeine', 'alcohol', 'exercise'].includes(habit)
    );
    score -= badHabits.length * 5;
    
    return Math.max(Math.min(score, 100), 15); // Keep between 15-100
  };

  const sleepScore = calculateSleepScore();
  
  const getSleepGrade = (score: number) => {
    if (score >= 85) return { grade: "A", color: "text-green-400", bg: "from-green-500 to-emerald-500", desc: "Excellent" };
    if (score >= 70) return { grade: "B", color: "text-yellow-400", bg: "from-yellow-500 to-orange-500", desc: "Good" };
    if (score >= 55) return { grade: "C", color: "text-orange-400", bg: "from-orange-500 to-red-500", desc: "Fair" };
    if (score >= 40) return { grade: "D", color: "text-red-400", bg: "from-red-500 to-red-600", desc: "Poor" };
    return { grade: "F", color: "text-red-500", bg: "from-red-600 to-red-700", desc: "Critical" };
  };

  const gradeInfo = getSleepGrade(sleepScore);

  // Calculate financial and life impact
  const getImpactData = () => {
    const severityMultiplier = (100 - sleepScore) / 100;
    return {
      annualLoss: Math.round(15000 * severityMultiplier),
      productivityLoss: Math.round(25 * severityMultiplier),
      healthRisk: Math.round(40 * severityMultiplier),
      moodImpact: Math.round(60 * severityMultiplier)
    };
  };

  const impactData = getImpactData();

  const problemAreas = [
    ...(assessmentData.challenges || []).map(challenge => ({
      issue: challenge.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: <AlertTriangle className="w-4 h-4" />,
      color: "text-red-400 bg-red-500/10 border-red-500/20"
    })),
    ...(assessmentData.habits || []).filter(habit => 
      ['phone-social', 'tv-streaming', 'work-email', 'caffeine', 'alcohol', 'exercise'].includes(habit)
    ).map(habit => ({
      issue: habit.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      icon: <Eye className="w-4 h-4" />,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/20"
    }))
  ];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
          <CardContent className="p-12 text-center">
            {/* Animated Luna Logo */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce">
                <Sparkles className="w-4 h-4 text-white m-1" />
              </div>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">Luna is Analyzing Your Sleep</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Processing your responses using advanced sleep science and AI...
            </p>
            
            {/* Loading Animation */}
            <div className="flex justify-center space-x-2 mb-8">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            {/* Financial Impact Teaser */}
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-bold text-red-300">The Hidden Cost of Poor Sleep</h3>
              </div>
              <p className="text-red-200 text-lg mb-4">
                Poor sleep costs the average person <span className="font-bold text-red-100">$15,000+ per year</span>
              </p>
              <div className="grid grid-cols-2 gap-4 text-red-200 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Lost productivity
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Health costs
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Cognitive decline
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Accident risk
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Your Sleep Analysis</h1>
          <p className="text-xl text-white/80">
            Here's what your sleep patterns reveal about your health and performance
          </p>
        </div>

        {/* Main Score Card - Prominent */}
        <Card className={`border-2 border-white/20 shadow-2xl bg-white/5 backdrop-blur-xl transition-all duration-1000 ${showScore ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Score Display */}
              <div className="text-center space-y-6">
                <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br ${gradeInfo.bg} shadow-2xl relative`}>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-1">
                      {gradeInfo.grade}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      {gradeInfo.desc}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center">
                    <Moon className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-white">Sleep Quality Score</h2>
                  <div className="text-5xl font-bold text-purple-300">{sleepScore}/100</div>
                  <div className="max-w-sm mx-auto">
                    <Progress 
                      value={sleepScore} 
                      className="h-3 bg-white/10"
                    />
                  </div>
                </div>
              </div>
              
              {/* Impact Statistics */}
              <div className="space-y-6">
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <DollarSign className="w-6 h-6 text-red-400" />
                    <h3 className="text-2xl font-bold text-red-300">Annual Impact</h3>
                  </div>
                  <div className="text-4xl font-bold text-red-200 mb-2">
                    ${impactData.annualLoss.toLocaleString()}
                  </div>
                  <p className="text-red-300">
                    Estimated yearly cost of your current sleep patterns
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                    <TrendingDown className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-300">{impactData.productivityLoss}%</div>
                    <div className="text-orange-400 text-sm">Productivity Loss</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-300">{impactData.healthRisk}%</div>
                    <div className="text-red-400 text-sm">Health Risk</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Problem Areas & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Problem Areas */}
          {problemAreas.length > 0 && (
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  Key Issues Identified
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {problemAreas.slice(0, 6).map((problem, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${problem.color}`}>
                    {problem.icon}
                    <span className="font-medium">{problem.issue}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* What You'll Gain */}
          <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <Star className="w-6 h-6 text-yellow-400" />
                What You'll Gain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: <Zap className="w-4 h-4" />, text: "200% more energy", color: "text-green-400 bg-green-500/10 border-green-500/20" },
                { icon: <Brain className="w-4 h-4" />, text: "Sharper focus & memory", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                { icon: <Target className="w-4 h-4" />, text: "Better work performance", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                { icon: <Heart className="w-4 h-4" />, text: "Stronger immune system", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
                { icon: <Coffee className="w-4 h-4" />, text: "Natural morning energy", color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
                { icon: <CheckCircle className="w-4 h-4" />, text: "Consistent great days", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" }
              ].map((benefit, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border ${benefit.color}`}>
                  {benefit.icon}
                  <span className="font-medium">{benefit.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* CTA Section - Make this HUGE and attention-grabbing */}
        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-purple-700 border-0 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"></div>
          <CardContent className="relative p-12 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Hero Icon */}
              <div className="inline-flex p-6 bg-white/10 rounded-3xl backdrop-blur-sm shadow-lg">
                <Sparkles className="w-16 h-16 text-yellow-300" />
              </div>
              
              {/* Main Headline */}
              <div className="space-y-4">
                <h2 className="text-6xl font-bold text-white leading-tight">
                  Ready to Transform
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Your Life?
                  </span>
                </h2>
                <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Let our AI build a personalized routine that fixes these exact problems. 
                  <span className="font-bold text-white"> See results in 7 days, guaranteed.</span>
                </p>
              </div>
              
              {/* Benefits Grid */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">What You Get:</h3>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  {[
                    { icon: <Brain className="w-5 h-5" />, text: "AI-personalized sleep schedule" },
                    { icon: <Moon className="w-5 h-5" />, text: "Custom bedtime routine" },
                    { icon: <Zap className="w-5 h-5" />, text: "Energy optimization plan" },
                    { icon: <Target className="w-5 h-5" />, text: "Progress tracking & coaching" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 text-white">
                      <div className="p-2 bg-white/10 rounded-lg">
                        {item.icon}
                      </div>
                      <span className="text-lg font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Giant CTA Button */}
              <div className="space-y-4">
                <Button
                  onClick={onContinueToSubscription}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-2xl px-12 py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-300/50"
                  size="lg"
                >
                  <Sparkles className="w-8 h-8 mr-3" />
                  Have Our AI Build Your Personal Routine
                  <ArrowRight className="w-8 h-8 ml-3" />
                </Button>
                
                <div className="flex items-center justify-center gap-6 text-blue-200 text-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    7-day guarantee
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Cancel anytime
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Join 50,000+ users
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AssessmentResultsPage;
