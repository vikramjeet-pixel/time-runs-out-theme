import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { differenceInMilliseconds, format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
}

interface GoalsTrackerProps {
  className?: string;
  birthdate: Date;
}

export function GoalsTracker({ className, birthdate }: GoalsTrackerProps) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(() => {
    const storedGoals = localStorage.getItem("life-goals");
    return storedGoals ? JSON.parse(storedGoals) : [];
  });
  
  const [newGoal, setNewGoal] = useState<{
    title: string;
    description: string;
    targetDate: string;
  }>({
    title: "",
    description: "",
    targetDate: "",
  });
  
  const [timeRemaining, setTimeRemaining] = useState<{[id: string]: {
    days: number;
    percentage: number;
  }}>({});
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const newTimeRemaining: {[id: string]: {days: number; percentage: number}} = {};
      
      goals.forEach(goal => {
        const targetDate = new Date(goal.targetDate);
        const remaining = differenceInMilliseconds(targetDate, now);
        const total = differenceInMilliseconds(targetDate, birthdate);
        const elapsed = total - remaining;
        
        const daysRemaining = Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24)));
        
        const percentageComplete = Math.min(100, Math.max(0, (elapsed / total) * 100));
        
        newTimeRemaining[goal.id] = {
          days: daysRemaining,
          percentage: percentageComplete,
        };
      });
      
      setTimeRemaining(newTimeRemaining);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [goals, birthdate]);
  
  useEffect(() => {
    localStorage.setItem("life-goals", JSON.stringify(goals));
  }, [goals]);
  
  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) {
      toast({
        title: "Incomplete Goal",
        description: "Please provide both a goal title and target date.",
        variant: "destructive",
      });
      return;
    }
    
    const targetDate = new Date(newGoal.targetDate);
    
    if (isNaN(targetDate.getTime())) {
      toast({
        title: "Invalid Date",
        description: "Please enter a valid target date.",
        variant: "destructive",
      });
      return;
    }
    
    if (targetDate < new Date()) {
      toast({
        title: "Invalid Date",
        description: "Target date must be in the future.",
        variant: "destructive",
      });
      return;
    }
    
    const newGoalItem: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      targetDate: targetDate,
    };
    
    setGoals(prev => [...prev, newGoalItem]);
    
    setNewGoal({
      title: "",
      description: "",
      targetDate: "",
    });
    
    toast({
      title: "Goal Added",
      description: "Your new life goal has been added.",
    });
  };
  
  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    
    toast({
      title: "Goal Removed",
      description: "Your life goal has been removed.",
    });
  };
  
  return (
    <Card className={cn("p-6", className)}>
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-display">Life Goals</CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="space-y-4">
          <div className="grid gap-3">
            <Input
              type="text"
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              className="h-20 min-h-0"
            />
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label htmlFor="targetDate" className="block text-sm font-medium mb-1">
                  Target Date
                </label>
                <Input
                  id="targetDate"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddGoal} className="flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Goal
              </Button>
            </div>
          </div>
        </div>
        
        {goals.length > 0 ? (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {goals.map(goal => {
              const timeLeft = timeRemaining[goal.id];
              return (
                <div key={goal.id} className="border rounded-md p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Target: {format(new Date(goal.targetDate), "MMM dd, yyyy")}</span>
                      <span>{timeLeft?.days || 0} days left</span>
                    </div>
                    <Progress value={timeLeft?.percentage || 0} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Add your first goal to start tracking
          </div>
        )}
      </CardContent>
    </Card>
  );
}
