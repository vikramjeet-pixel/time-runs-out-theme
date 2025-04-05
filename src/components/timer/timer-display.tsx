
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
}

export function TimerDisplay({
  birthdate,
  lifeExpectancy,
  displayUnit = "years",
  className,
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

  return (
    <Card className={cn("p-6 flex flex-col items-center gap-4", className)}>
      <div className="flex items-center justify-between w-full">
        <div
          className={cn(
            "text-4xl md:text-6xl font-mono transition-opacity font-display",
            animate ? "animate-pulse-slow" : ""
          )}
        >
          {value}
        </div>
      </div>
      
      <div className="w-full space-y-2">
        <div className="flex justify-between text-sm">
          <span>Life Progress</span>
          <span>{Math.round(timeRemaining.percentageComplete)}%</span>
        </div>
        <Progress value={timeRemaining.percentageComplete} />
      </div>
      
      <div className="w-full mt-4">
        <GoalsTracker birthdate={birthdate} />
      </div>
    </Card>
  );
}
