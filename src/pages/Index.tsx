
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimerDisplay } from "@/components/timer/timer-display";
import { SettingsForm } from "@/components/timer/settings-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { useToast } from "@/components/ui/use-toast";

type DisplayUnit = "years" | "days" | "hours" | "minutes";

const Index = () => {
  const { toast } = useToast();
  
  // Default to 30 years ago
  const defaultBirthdate = new Date();
  defaultBirthdate.setFullYear(defaultBirthdate.getFullYear() - 30);
  
  // Get settings from localStorage or use defaults
  const [birthdate, setBirthdate] = useState<Date>(() => {
    const storedDate = localStorage.getItem("death-timer-birthdate");
    return storedDate ? new Date(storedDate) : defaultBirthdate;
  });
  
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(() => {
    const stored = localStorage.getItem("death-timer-life-expectancy");
    return stored ? parseInt(stored) : 80;
  });
  
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>(() => {
    const stored = localStorage.getItem("death-timer-display-unit");
    return (stored as DisplayUnit) || "years";
  });
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("death-timer-birthdate", birthdate.toISOString());
    localStorage.setItem("death-timer-life-expectancy", lifeExpectancy.toString());
    localStorage.setItem("death-timer-display-unit", displayUnit);
  }, [birthdate, lifeExpectancy, displayUnit]);

  // Handle birthdate changes
  const handleSetBirthdate = (date: Date) => {
    setBirthdate(date);
    toast({
      title: "Birthdate Updated",
      description: "Your timer has been recalculated.",
    });
  };

  // Handle life expectancy changes
  const handleSetLifeExpectancy = (years: number) => {
    setLifeExpectancy(years);
  };

  // Handle display unit changes
  const handleSetDisplayUnit = (unit: string) => {
    setDisplayUnit(unit as DisplayUnit);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <header className="border-b py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-display font-bold">Memento Mori</h1>
          <ThemeToggle />
        </header>
        
        <main className="flex-1 container max-w-6xl py-8 px-4">
          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <div className="space-y-8">
              <TimerDisplay
                birthdate={birthdate}
                lifeExpectancy={lifeExpectancy}
                displayUnit={displayUnit as DisplayUnit}
                className="min-h-[200px]"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>About This Timer</CardTitle>
                  <CardDescription>
                    "Memento mori" is a Latin phrase meaning "remember that you will die."
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose dark:prose-invert">
                  <p>
                    This timer visualizes your remaining time based on average
                    life expectancy statistics. It's a tool for reflection, not prediction.
                  </p>
                  <p>
                    The practice of contemplating mortality has been embraced by philosophers,
                    artists, and spiritual traditions throughout history as a way to appreciate
                    life and focus on what truly matters.
                  </p>
                  <blockquote>
                    "Let us prepare our minds as if we'd come to the very end of life. 
                    Let us postpone nothing. Let us balance life's books each day." 
                    — Seneca
                  </blockquote>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <SettingsForm
                birthdate={birthdate}
                setBirthdate={handleSetBirthdate}
                lifeExpectancy={lifeExpectancy}
                setLifeExpectancy={handleSetLifeExpectancy}
                displayUnit={displayUnit}
                setDisplayUnit={handleSetDisplayUnit}
              />
            </div>
          </div>
        </main>
        
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Memento Mori Timer • Time is precious, use it wisely.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
