import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  targetDate: Date;
  onTimerZero?: () => void;
}

export default function InGameTimer({ targetDate, onTimerZero }: Props) {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Date.now();
      const timeRemaining = targetDate.getTime() - now;
      
      return Math.max(0, Math.floor(timeRemaining / 1000));
    };

    // Set initial time
    setSecondsRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      
      setSecondsRemaining(remaining);
      
      // Trigger callback when countdown reaches 0
      if (remaining === 0) {
        onTimerZero?.();
        clearInterval(interval); // Stop the timer when it reaches 0
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [targetDate, onTimerZero]);

  return (
    <div className="font-medium font-mono text-lg md:text-4xl">
      <span className="flex items-center gap-0.5">
        <Clock size={20} />
        {secondsRemaining}
      </span>
    </div>
  );
}