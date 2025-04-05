
import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LifeCalendarProps {
  birthdate: Date;
  lifeExpectancy: number;
}

export function LifeCalendar({ birthdate, lifeExpectancy }: LifeCalendarProps) {
  // Each box represents approximately 3 months (a quarter) of life
  const totalQuarters = lifeExpectancy * 4;
  
  const lifeData = useMemo(() => {
    const now = new Date();
    const ageInMilliseconds = now.getTime() - birthdate.getTime();
    const ageInQuarters = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 91.25));
    
    return {
      lived: Math.min(ageInQuarters, totalQuarters),
      remaining: Math.max(0, totalQuarters - ageInQuarters),
      total: totalQuarters
    };
  }, [birthdate, totalQuarters]);

  // Create an array of quarters
  const quarters = Array.from({ length: totalQuarters }, (_, i) => ({
    id: i,
    isLived: i < lifeData.lived,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Your Life in Quarters</CardTitle>
        <p className="text-sm text-muted-foreground">
          Each box represents approximately 3 months of your life
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-16 gap-1 mx-auto max-w-2xl">
          {quarters.map((quarter) => (
            <div
              key={quarter.id}
              className={cn(
                "w-4 h-4 rounded-sm border",
                quarter.isLived 
                  ? "bg-primary border-primary" 
                  : "bg-secondary border-border"
              )}
              title={`Quarter ${quarter.id + 1} of your life`}
            />
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Birth</span>
          <span>{lifeExpectancy} years</span>
        </div>
      </CardContent>
    </Card>
  );
}
