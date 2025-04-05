
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLifetimeCalculator } from "@/hooks/use-lifetime-calculator";

interface TimeReportsProps {
  birthdate: Date;
  lifeExpectancy: number;
}

export function TimeReports({ birthdate, lifeExpectancy }: TimeReportsProps) {
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  
  const timeRemaining = useLifetimeCalculator({
    birthdate,
    lifeExpectancy,
  });

  const getWeeklyStats = () => {
    const totalDays = timeRemaining.years * 365.25 + 
                     timeRemaining.months * 30.437 + 
                     timeRemaining.days;
    const weeksRemaining = Math.floor(totalDays / 7);
    const totalWeeksInLife = Math.floor(lifeExpectancy * 52.143);
    const weeksLived = totalWeeksInLife - weeksRemaining;
    const percentWeeksLived = (weeksLived / totalWeeksInLife) * 100;

    return {
      remaining: weeksRemaining.toLocaleString(),
      lived: weeksLived.toLocaleString(),
      total: totalWeeksInLife.toLocaleString(),
      percent: percentWeeksLived.toFixed(1)
    };
  };

  const getMonthlyStats = () => {
    const totalMonths = timeRemaining.years * 12 + timeRemaining.months;
    const totalMonthsInLife = lifeExpectancy * 12;
    const monthsLived = totalMonthsInLife - totalMonths;
    const percentMonthsLived = (monthsLived / totalMonthsInLife) * 100;

    return {
      remaining: totalMonths.toLocaleString(),
      lived: monthsLived.toLocaleString(),
      total: totalMonthsInLife.toLocaleString(),
      percent: percentMonthsLived.toFixed(1)
    };
  };

  // Get stats based on current report type
  const stats = reportType === "weekly" ? getWeeklyStats() : getMonthlyStats();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" onValueChange={(value) => setReportType(value as "weekly" | "monthly")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-md p-4 text-center">
                <h4 className="text-sm font-medium mb-1">Weeks Lived</h4>
                <p className="text-2xl font-bold">{stats.lived}</p>
                <p className="text-xs text-muted-foreground mt-1">({stats.percent}%)</p>
              </div>
              <div className="bg-secondary rounded-md p-4 text-center">
                <h4 className="text-sm font-medium mb-1">Weeks Remaining</h4>
                <p className="text-2xl font-bold">{stats.remaining}</p>
                <p className="text-xs text-muted-foreground mt-1">of {stats.total}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Make each week count! Your weekly progress toward your life goals.
            </p>
          </TabsContent>
          <TabsContent value="monthly" className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary rounded-md p-4 text-center">
                <h4 className="text-sm font-medium mb-1">Months Lived</h4>
                <p className="text-2xl font-bold">{stats.lived}</p>
                <p className="text-xs text-muted-foreground mt-1">({stats.percent}%)</p>
              </div>
              <div className="bg-secondary rounded-md p-4 text-center">
                <h4 className="text-sm font-medium mb-1">Months Remaining</h4>
                <p className="text-2xl font-bold">{stats.remaining}</p>
                <p className="text-xs text-muted-foreground mt-1">of {stats.total}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Monthly view of your life progress. Set monthly goals to make your time meaningful.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
