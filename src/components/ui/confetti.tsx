
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ duration = 3000 }) => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (isActive) {
      const end = Date.now() + duration;

      // Launch fireworks every 200ms
      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          setIsActive(false);
          return;
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [duration, isActive]);

  return null; // This component doesn't render any visible UI
};
