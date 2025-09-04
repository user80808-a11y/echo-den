export interface SleepQuestionnaireData {
  age: string;
  sleepGoal: string;
  currentBedtime: string;
  desiredBedtime: string;
  currentWakeTime: string;
  desiredWakeTime: string;
  sleepDuration: string;
  sleepQuality: string;
  energyLevels: string;
  sleepEnvironment: string;
  stressLevel: string;
  exerciseHabits: string;
  caffeineIntake: string;
  caffeine: string;
  screenTime: string;
  sleepChallenges: string[];
  sleepGoals: string[];
  sleepIssues: string[];
  lifestyle: string;
  workSchedule: string;
  weekendSleep: string;
  naps: string;
  additionalInfo: string;
}

export interface SleepQuestion {
  id: keyof SleepQuestionnaireData;
  type: "choice" | "time" | "text" | "multiple" | "scale";
  question: string;
  subtitle?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface SleepProfile {
  chronotype: string;
  optimalBedtime: string;
  optimalWakeTime: string;
  sleepDuration: string;
}

export interface SleepRecommendation {
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

export interface QuestionnaireResult {
  profile: SleepProfile;
  recommendations: SleepRecommendation[];
}
