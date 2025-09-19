import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  secondsPerGuess: number;
  lastGuessDateTime: Date;
}

export default function InGameTimer({ secondsPerGuess, lastGuessDateTime }: Props) {
  const [secondsRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const targetTime = new Date(lastGuessDateTime).getTime() + (secondsPerGuess * 1000);
      const difference = targetTime - now;
      
      return Math.max(0, Math.floor(difference / 1000));
    };

    // Set initial time
    setTimeRemaining(calculateTimeRemaining());

    // Update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      // Clear interval when countdown reaches 0
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [secondsPerGuess, lastGuessDateTime]);

  return (
    <div className="font-medium font-monos text-lg md:text-4xl">
      <span className="flex items-center gap-0.5">
        <Clock size={20} />
        {secondsRemaining}
      </span>
    </div>
  );
}