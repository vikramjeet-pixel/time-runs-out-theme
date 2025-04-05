
import { useState, useEffect } from "react";
import { Confetti } from "@/components/ui/confetti";
import { useToast } from "@/components/ui/use-toast";
import { useLifetimeCalculator } from "@/hooks/use-lifetime-calculator";

interface MilestoneCelebrationsProps {
  birthdate: Date;
  lifeExpectancy: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  threshold: number; // percentage complete
  triggered: boolean;
}

export function MilestoneCelebrations({ birthdate, lifeExpectancy }: MilestoneCelebrationsProps) {
  const { toast } = useToast();
  const timeRemaining = useLifetimeCalculator({
    birthdate,
    lifeExpectancy,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "quarter",
      title: "Quarter Life",
      description: "You've completed 25% of your expected life journey.",
      threshold: 25,
      triggered: false,
    },
    {
      id: "third",
      title: "One-Third Life",
      description: "You've completed 33% of your expected life journey.",
      threshold: 33,
      triggered: false,
    },
    {
      id: "half",
      title: "Half Life",
      description: "You've completed 50% of your expected life journey.",
      threshold: 50,
      triggered: false,
    },
    {
      id: "two-thirds",
      title: "Two-Thirds Life",
      description: "You've completed 66% of your expected life journey.",
      threshold: 66,
      triggered: false,
    },
    {
      id: "three-quarters",
      title: "Three-Quarters Life",
      description: "You've completed 75% of your expected life journey.",
      threshold: 75,
      triggered: false,
    },
  ]);

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const currentPercentage = timeRemaining.percentageComplete;
    
    // Check for untriggered milestones that have been reached
    const newMilestones = milestones.map(milestone => {
      if (!milestone.triggered && currentPercentage >= milestone.threshold) {
        // Trigger celebration
        toast({
          title: `🎉 ${milestone.title} Milestone Reached!`,
          description: milestone.description,
        });
        
        // Show confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
        
        return { ...milestone, triggered: true };
      }
      return milestone;
    });
    
    setMilestones(newMilestones);
  }, [timeRemaining.percentageComplete, milestones, toast]);

  return <>{showConfetti && <Confetti />}</>;
}
