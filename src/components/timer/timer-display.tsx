
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useLifetimeCalculator } from "@/hooks/use-lifetime-calculator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { GoalsTracker } from "./goals-tracker";

type DisplayUnit = "years" | "days" | "hours" | "minutes";

interface TimerDisplayProps {
  birthdate: Date;
  lifeExpectancy: number;
  displayUnit?: DisplayUnit;
  className?: string;
  compact?: boolean; // New prop for widget-like display
}

export function TimerDisplay({
  birthdate,
  lifeExpectancy,
  displayUnit = "years",
  className,
  compact = false,
}: TimerDisplayProps) {
  const timeRemaining = useLifetimeCalculator({
    birthdate,
    lifeExpectancy,
  });

  const [value, setValue] = useState("");
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Format the display value based on the selected unit
    let formattedValue;
    switch (displayUnit) {
      case "years":
        formattedValue = timeRemaining.years.toString().padStart(2, "0") + "y " +
                         timeRemaining.months.toString().padStart(2, "0") + "m " +
                         timeRemaining.days.toString().padStart(2, "0") + "d";
        break;
      case "days":
        const totalDays = timeRemaining.years * 365.25 + 
                          timeRemaining.months * 30.437 + 
                          timeRemaining.days;
        formattedValue = Math.floor(totalDays).toLocaleString() + " days";
        break;
      case "hours":
        const totalHours = (timeRemaining.years * 365.25 + 
                           timeRemaining.months * 30.437 + 
                           timeRemaining.days) * 24 + 
                           timeRemaining.hours;
        formattedValue = Math.floor(totalHours).toLocaleString() + " hours";
        break;
      case "minutes":
        const totalMinutes = ((timeRemaining.years * 365.25 + 
                             timeRemaining.months * 30.437 + 
                             timeRemaining.days) * 24 + 
                             timeRemaining.hours) * 60 + 
                             timeRemaining.minutes;
        formattedValue = Math.floor(totalMinutes).toLocaleString() + " minutes";
        break;
    }

    setValue(formattedValue || "");

    // Create a pulse animation when seconds change
    if (timeRemaining.seconds === 0) {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 1000);
    }
  }, [timeRemaining, displayUnit]);

  // Return compact version for widgets/lockscreen
  if (compact) {
    return (
      <div className="space-y-2 p-4">
        <div
          className={cn(
            "text-2xl font-display tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-bold",
            animate ? "animate-pulse-slow" : ""
          )}
        >
          {value}
        </div>
        <Progress 
          value={timeRemaining.percentageComplete} 
          className="h-1.5" 
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={cn("p-6 flex flex-col items-center gap-4", className)}>
        <div className="flex items-center justify-between w-full">
          <div
            className={cn(
              "text-4xl md:text-6xl font-display tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-bold",
              animate ? "animate-pulse-slow" : ""
            )}
          >
            {value}
          </div>
        </div>
        
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-muted-foreground">Life Progress</span>
            <span className="font-semibold">{Math.round(timeRemaining.percentageComplete)}%</span>
          </div>
          <Progress value={timeRemaining.percentageComplete} className="h-2" />
        </div>
        
        <div className="w-full mt-4">
          <GoalsTracker birthdate={birthdate} />
        </div>
      </Card>
    </div>
  );
}
