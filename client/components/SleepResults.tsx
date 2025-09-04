import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Target } from "lucide-react";

interface SleepProfile {
  chronotype: string;
  optimalBedtime: string;
  optimalWakeTime: string;
  sleepDuration: string;
}

interface Recommendation {
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface SleepResultsProps {
  profile: SleepProfile;
  recommendations: Recommendation[];
  onContinue: () => void;
}

export function SleepResults({ profile, recommendations, onContinue }: SleepResultsProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Sleep Profile Ready!</h2>
        <p className="text-gray-600">Based on your responses, here's your personalized sleep optimization plan</p>
      </div>

      {/* Sleep Profile */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Your Sleep Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Chronotype</h4>
              <p className="text-blue-600 font-semibold">{profile.chronotype}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Sleep Duration</h4>
              <p className="text-blue-600 font-semibold">{profile.sleepDuration}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Optimal Bedtime</h4>
              <p className="text-blue-600 font-semibold">{profile.optimalBedtime}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-1">Optimal Wake Time</h4>
              <p className="text-blue-600 font-semibold">{profile.optimalWakeTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{rec.title}</h4>
                  <Badge className={getPriorityColor(rec.priority)}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                <Badge variant="outline" className="text-xs">
                  {rec.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={onContinue} className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
          Continue to Your Schedule
        </Button>
      </div>
    </div>
  );
}

export default SleepResults;
