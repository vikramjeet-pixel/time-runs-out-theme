
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
import { Share, PlusCircle, Info, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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

  const [showAddToHomeDialog, setShowAddToHomeDialog] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("death-timer-birthdate", birthdate.toISOString());
    localStorage.setItem("death-timer-life-expectancy", lifeExpectancy.toString());
    localStorage.setItem("death-timer-display-unit", displayUnit);
  }, [birthdate, lifeExpectancy, displayUnit]);

  // Check if app is installable
  useEffect(() => {
    const isAppAlreadyInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isAppAlreadyInstalled) {
      setShowNotificationBanner(true);
      
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e);
        setIsInstallable(true);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  // Handle installation
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      // We no longer need the prompt
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        toast({
          title: "App installed!",
          description: "You can now access the timer from your home screen.",
        });
      }
    } else {
      // If we can't use the deferred prompt, show instructions dialog
      setShowAddToHomeDialog(true);
    }
  };

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
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleInstallClick}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add to Home</span>
            </Button>
            <ThemeToggle />
          </div>
        </header>
        
        {showNotificationBanner && (
          <div className="bg-primary/10 p-2 flex items-center justify-between">
            <p className="text-sm text-center flex-1">
              Add this timer to your home screen for quick access!
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowNotificationBanner(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        )}
        
        <main className="flex-1 container max-w-6xl py-8 px-4">
          <div className="grid gap-8 md:grid-cols-[1fr_350px]">
            <div className="space-y-8">
              <TimerDisplay
                birthdate={birthdate}
                lifeExpectancy={lifeExpectancy}
                displayUnit={displayUnit as DisplayUnit}
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

      {/* Dialog with instructions for adding to home screen */}
      <Dialog open={showAddToHomeDialog} onOpenChange={setShowAddToHomeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Home Screen</DialogTitle>
            <DialogDescription>
              Follow these instructions to add the Memento Mori timer to your device's home screen:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">On iOS:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Tap the share icon (box with arrow) at the bottom of the screen</li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">On Android:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Tap the three dots (menu) in the top right of your browser</li>
                <li>Tap "Add to Home screen" or "Install app"</li>
                <li>Follow the prompts to add the timer</li>
              </ol>
            </div>

            <div className="rounded-md bg-muted p-3 text-sm flex items-start gap-3">
              <Info className="h-4 w-4 mt-0.5 text-primary" />
              <div>
                <p>Once added to your home screen, the timer will be available as a standalone app with a more compact display suitable for widgets and lock screens.</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAddToHomeDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ThemeProvider>
    </ThemeProvider>
  );
};

export default Index;
