
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface AnalogClockProps {
  className?: string;
  showSeconds?: boolean;
  size?: number;
}

export function AnalogClock({ 
  className, 
  showSeconds = true, 
  size = 200 
}: AnalogClockProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Calculate hand rotations
  const secondsRatio = time.getSeconds() / 60;
  const minutesRatio = (secondsRatio + time.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + time.getHours()) / 12;

  const secondsRotation = secondsRatio * 360;
  const minutesRotation = minutesRatio * 360;
  const hoursRotation = hoursRatio * 360;

  return (
    <div className={cn("relative aspect-square", className)} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border-4 border-primary/20 bg-card shadow-lg flex items-center justify-center">
        {/* Clock face */}
        <div className="relative w-full h-full rounded-full flex items-center justify-center">
          {/* Hours markers */}
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 bg-primary"
              style={{ 
                height: i % 3 === 0 ? '12%' : '8%', 
                transform: `rotate(${i * 30}deg) translateY(-200%)` 
              }}
            />
          ))}

          {/* Hands */}
          <div 
            className="absolute w-[2%] rounded-full bg-foreground origin-bottom"
            style={{ 
              height: '30%', 
              transform: `rotate(${hoursRotation}deg) translateY(-50%)`,
              transformOrigin: '50% 100%'
            }}
          />
          <div 
            className="absolute w-[1%] rounded-full bg-foreground origin-bottom"
            style={{ 
              height: '40%', 
              transform: `rotate(${minutesRotation}deg) translateY(-50%)`,
              transformOrigin: '50% 100%'
            }}
          />
          {showSeconds && (
            <div 
              className="absolute w-[0.8%] rounded-full bg-primary origin-bottom"
              style={{ 
                height: '45%', 
                transform: `rotate(${secondsRotation}deg) translateY(-50%)`,
                transformOrigin: '50% 100%'
              }}
            />
          )}
          
          {/* Center dot */}
          <div className="absolute w-3 h-3 rounded-full bg-primary z-10" />
        </div>
      </div>
    </div>
  );
}
