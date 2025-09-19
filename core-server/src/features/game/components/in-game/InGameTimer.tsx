import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  secondsPerGuess: number;
  lastGuessUnixUtcTimestamp: number;
  onTimerZero?: () => void;
}

export default function InGameTimer({ secondsPerGuess, lastGuessUnixUtcTimestamp, onTimerZero }: Props) {
  const [secondsRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now(); // Already in milliseconds
      const timeSinceLastGuess = now - (lastGuessUnixUtcTimestamp * 1000);
      const cyclePosition = timeSinceLastGuess % (secondsPerGuess * 1000);
      const timeRemainingInCycle = (secondsPerGuess * 1000) - cyclePosition;
      
      return Math.max(0, Math.floor(timeRemainingInCycle / 1000));
    };

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      const previousRemaining = secondsRemaining;
      
      setTimeRemaining(remaining);
      
      // Trigger callback when countdown reaches 0 (transitioning from 1 to 0)
      if (remaining === 0 && previousRemaining === 1) {
        onTimerZero?.();
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [secondsPerGuess, lastGuessUnixUtcTimestamp, onTimerZero, secondsRemaining]);

  return (
    <div className="font-medium font-monos text-lg md:text-4xl">
      <span className="flex items-center gap-0.5">
        <Clock size={20} />
        {secondsRemaining}
      </span>
    </div>
  );
}