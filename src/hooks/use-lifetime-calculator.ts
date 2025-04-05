
import { useEffect, useState } from "react";
import { differenceInMilliseconds, addYears } from "date-fns";

interface LifetimeCalculatorOptions {
  birthdate: Date;
  lifeExpectancy: number;
}

export interface TimeRemaining {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  totalMilliseconds: number;
  percentageComplete: number;
}

export const useLifetimeCalculator = ({
  birthdate,
  lifeExpectancy,
}: LifetimeCalculatorOptions) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    totalMilliseconds: 0,
    percentageComplete: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const estimatedEndDate = addYears(birthdate, lifeExpectancy);
      const totalLifespan = differenceInMilliseconds(estimatedEndDate, birthdate);
      const elapsed = differenceInMilliseconds(now, birthdate);
      const remaining = differenceInMilliseconds(estimatedEndDate, now);

      // Calculate percentage complete
      const percentageComplete = Math.min(100, Math.max(0, (elapsed / totalLifespan) * 100));

      // Break down the remaining time
      const millisecondsInSecond = 1000;
      const millisecondsInMinute = millisecondsInSecond * 60;
      const millisecondsInHour = millisecondsInMinute * 60;
      const millisecondsInDay = millisecondsInHour * 24;
      const millisecondsInMonth = millisecondsInDay * 30.437; // Average month length
      const millisecondsInYear = millisecondsInDay * 365.25; // Account for leap years

      const years = Math.floor(remaining / millisecondsInYear);
      let remainder = remaining % millisecondsInYear;

      const months = Math.floor(remainder / millisecondsInMonth);
      remainder = remainder % millisecondsInMonth;

      const days = Math.floor(remainder / millisecondsInDay);
      remainder = remainder % millisecondsInDay;

      const hours = Math.floor(remainder / millisecondsInHour);
      remainder = remainder % millisecondsInHour;

      const minutes = Math.floor(remainder / millisecondsInMinute);
      remainder = remainder % millisecondsInMinute;

      const seconds = Math.floor(remainder / millisecondsInSecond);
      const milliseconds = remainder % millisecondsInSecond;

      setTimeRemaining({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        milliseconds,
        totalMilliseconds: remaining,
        percentageComplete,
      });
    };

    calculateTimeRemaining();
    const intervalId = setInterval(calculateTimeRemaining, 100);

    return () => clearInterval(intervalId);
  }, [birthdate, lifeExpectancy]);

  return timeRemaining;
};
