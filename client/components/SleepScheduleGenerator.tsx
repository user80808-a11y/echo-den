import { useState } from "react";
import SleepAssessment from "./SleepAssessment";
import { SchedulePreview } from "./SchedulePreview";
import { useAuth } from "@/contexts/AuthContext";
import { saveSleepSchedule } from "@/lib/firebaseService";
import * as Icons from "lucide-react";

interface SleepData {
  bedtime: string;
  wakeTime: string;
  sleepHours: number;
  sleepQuality: string;
  challenges: string[];
  goals: string[];
  lifestyle: string;
  environment: string;
  chronotype: string;
  caffeine: string;
  electronics: string;
  stress: string;
  weekendPattern: string;
}

interface ScheduleItem {
  time: string;
  activity: string;
  description: string;
  category: "evening" | "night" | "morning";
  icon: React.ReactNode;
}

interface SleepScheduleGeneratorProps {
  onScheduleCreated?: () => void;
}

export function SleepScheduleGenerator({
  onScheduleCreated,
}: SleepScheduleGeneratorProps = {}) {
  const { user } = useAuth();
  const [step, setStep] = useState<"questionnaire" | "schedule">(
    "questionnaire",
  );
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionnaireData, setQuestionnaireData] =
    useState<SleepData | null>(null);

  const getActivityIcon = (activity: string) => {
    const activityLower = activity.toLowerCase();
    if (activityLower.includes("coffee") || activityLower.includes("caffeine"))
      return <Icons.Coffee className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("screen") || activityLower.includes("phone"))
      return <Icons.Smartphone className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("read") || activityLower.includes("book"))
      return <Icons.Book className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("exercise") || activityLower.includes("workout"))
      return <Icons.Dumbbell className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("bath") || activityLower.includes("shower"))
      return <Icons.Bath className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("music") || activityLower.includes("meditation"))
      return <Icons.Music className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("wake") || activityLower.includes("morning"))
      return <Icons.Sun className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("bed") || activityLower.includes("sleep"))
      return <Icons.Bed className="h-5 w-5 text-sleep-primary" />;
    if (activityLower.includes("evening") || activityLower.includes("wind"))
      return <Icons.Moon className="h-5 w-5 text-sleep-primary" />;
    return <Icons.Clock className="h-5 w-5 text-sleep-primary" />;
  };

  const handleQuestionnaireComplete = async (data: SleepData) => {
    setIsGenerating(true);
    setStep("schedule");

    try {
      const response = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success && result.data.schedule) {
        // Convert AI response to schedule items with icons
        const scheduleItems: ScheduleItem[] = result.data.schedule.map(
          (item: any) => ({
            ...item,
            icon: getActivityIcon(item.activity),
          }),
        );
        setSchedule(scheduleItems);

        // Save schedule to Firebase if user is logged in
        if (user && data) {
          try {
            const now = new Date().toISOString();
            await saveSleepSchedule({
              userId: user.id,
              title: `Sleep Schedule - ${new Date().toLocaleDateString()}`,
              schedule: scheduleItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category,
              })),
              createdAt: now,
              updatedAt: now,
              questionnaireData: data,
              isActive: true,
            });
            console.log("Schedule saved to Firebase successfully");
            // Notify parent component that schedule was created
            onScheduleCreated?.();
          } catch (error) {
            console.error("Error saving schedule to Firebase:", error);
          }
        }
      } else {
    // Comprehensive fallback schedule if AI fails
    const fallbackScheduleItems: ScheduleItem[] = [
          {
            time: "5:30 PM",
            activity: "Work wrap-up",
            description:
              "Finish final work tasks and organize tomorrow's priorities",
      category: "evening",
      icon: <Icons.Clock className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "6:00 PM",
            activity: "Transition time",
            description:
              "Change clothes, wash hands, and mentally shift from work to personal time",
      category: "evening",
      icon: <Icons.Clock className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "6:30 PM",
            activity: "Light exercise",
            description:
              "Take a 20-minute walk or do gentle stretching to release work tension",
      category: "evening",
      icon: <Icons.Dumbbell className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "7:00 PM",
            activity: "Dinner preparation",
            description:
              "Prepare a light, nutritious dinner avoiding heavy or spicy foods",
      category: "evening",
      icon: <Icons.Coffee className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "8:00 PM",
            activity: "Personal time",
            description:
              "Engage in relaxing hobbies, connect with family, or enjoy quiet activities",
      category: "evening",
      icon: <Icons.Book className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "8:30 PM",
            activity: "Digital sunset",
            description:
              "Turn off all screens and electronic devices to reduce blue light exposure",
      category: "evening",
      icon: <Icons.Smartphone className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "9:00 PM",
            activity: "Evening hygiene",
            description:
              "Complete evening hygiene routine including brushing teeth and skincare",
      category: "evening",
      icon: <Icons.Bath className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "9:30 PM",
            activity: "Relaxing activity",
            description:
              "Read a book, listen to calming music, or practice gentle stretching",
      category: "night",
      icon: <Icons.Book className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "10:00 PM",
            activity: "Bedroom preparation",
            description:
              "Prepare your sleep environment - cool, dark, and quiet",
      category: "night",
      icon: <Icons.Bed className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "10:15 PM",
            activity: "Meditation or breathing",
            description:
              "Practice 10-15 minutes of meditation or deep breathing exercises",
      category: "night",
      icon: <Icons.Music className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "10:30 PM",
            activity: "Lights out",
            description: "Turn off all lights and begin your sleep cycle",
      category: "night",
      icon: <Icons.Moon className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "6:30 AM",
            activity: "Natural wake-up",
            description:
              "Wake up at your target time and immediately expose yourself to natural light",
      category: "morning",
      icon: <Icons.Sun className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "6:45 AM",
            activity: "Hydrate and stretch",
            description:
              "Drink 16-20oz of water and do 5-10 minutes of gentle stretching",
      category: "morning",
      icon: <Icons.Dumbbell className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "7:00 AM",
            activity: "Morning sunlight",
            description:
              "Spend 10-15 minutes outside or near a bright window to set your circadian rhythm",
      category: "morning",
      icon: <Icons.Sun className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "7:30 AM",
            activity: "Morning routine",
            description: "Complete morning hygiene and get dressed for the day",
      category: "morning",
      icon: <Icons.Coffee className="h-5 w-5 text-sleep-primary" />,
          },
          {
            time: "8:00 AM",
            activity: "Energizing start",
            description:
              "Begin your productive day with energy and clear intentions",
      category: "morning",
      icon: <Icons.Coffee className="h-5 w-5 text-sleep-primary" />,
          },
        ];
        setSchedule(fallbackScheduleItems);

        // Save fallback schedule to Firebase if user is logged in
        if (user && data) {
          try {
            const now = new Date().toISOString();
            await saveSleepSchedule({
              userId: user.id,
              title: `Sleep Schedule - ${new Date().toLocaleDateString()}`,
              schedule: fallbackScheduleItems.map((item) => ({
                time: item.time,
                activity: item.activity,
                description: item.description,
                category: item.category as 'evening' | 'night' | 'morning',
              })),
              questionnaireData: data,
              isActive: true,
              createdAt: now,
              updatedAt: now,
            });
            console.log("Fallback schedule saved to Firebase successfully");
            // Notify parent component that schedule was created
            onScheduleCreated?.();
          } catch (error) {
            console.error("Error saving fallback schedule to Firebase:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      // Use simple error schedule on connection error
      const errorSchedule: ScheduleItem[] = [
        {
          time: "7:00 PM",
          activity: "Evening preparation",
          description: "Start preparing for a good night's sleep",
          category: "evening",
          icon: <Icons.Clock className="h-5 w-5 text-sleep-primary" />,
        },
        {
          time: "8:30 PM",
          activity: "Digital sunset",
          description: "Turn off screens and electronic devices",
          category: "evening",
          icon: <Icons.Smartphone className="h-5 w-5 text-sleep-primary" />,
        },
        {
          time: "9:30 PM",
          activity: "Relaxation time",
          description: "Read, meditate, or do gentle stretching",
          category: "night",
          icon: <Icons.Book className="h-5 w-5 text-sleep-primary" />,
        },
        {
          time: "10:30 PM",
          activity: "Bedtime",
          description: "Go to sleep for optimal rest",
          category: "night",
          icon: <Icons.Bed className="h-5 w-5 text-sleep-primary" />,
        },
        {
          time: "6:30 AM",
          activity: "Wake up",
          description: "Start your day refreshed and energized",
          category: "morning",
          icon: <Icons.Sun className="h-5 w-5 text-sleep-primary" />,
        },
        {
          time: "7:00 AM",
          activity: "Morning routine",
          description: "Begin your productive day with intention",
          category: "morning",
          icon: <Icons.Coffee className="h-5 w-5 text-sleep-primary" />,
        },
      ];
      setSchedule(errorSchedule);
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === "questionnaire") {
    return <SleepAssessment onComplete={handleQuestionnaireComplete} />;
  }

  return (
    <SchedulePreview
      schedule={schedule}
      isGenerating={isGenerating}
      onGoToDashboard={onScheduleCreated}
    />
  );
}
