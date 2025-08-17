import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock } from 'lucide-react';

interface InGameTimerProps {
  timePerTurn: number;
  initialTime: number; // in seconds
  onTimerEnd?: () => void;
  isPaused?: boolean;
  warningThreshold?: number; // seconds when to show warning state
}

export default function InGameTimer({
  timePerTurn,
  initialTime,
  onTimerEnd,
  warningThreshold = 7,
  isPaused = false
}: InGameTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const hasEndedRef = useRef(false);

  // Get timer state for styling
  const getTimerState = useCallback(() => {
    if (secondsLeft <= warningThreshold) return 'warning';
    return 'normal';
  }, [secondsLeft, warningThreshold]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (secondsLeft == -1) {
      setSecondsLeft(timePerTurn);
    }

    if (!isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          // Check if timer just ended and hasn't been handled yet
          if (newTime <= 0 && !hasEndedRef.current) {
            hasEndedRef.current = true;
            // Schedule the callback to run after the current render cycle
            setTimeout(() => {
              if (onTimerEnd) onTimerEnd();
            }, 0);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, initialTime, onTimerEnd]);

  // Reset the ended flag when timer is reset
  useEffect(() => {
    if (secondsLeft > 0) {
      hasEndedRef.current = false;
    }
  }, [secondsLeft]);

  const timerState = getTimerState();

  // Dynamic styling based on timer state
  const getTimerStyles = () => {
    const baseStyles = "font-mono font-bold transition-all duration-300 text-xl sm:text-2xl";
        
    switch (timerState) {
      case 'warning':
        return `${baseStyles} text-warning`;
      default:
        return `${baseStyles} text-foreground`;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Timer Display */}
      <div className="flex items-center space-x-3">
        <Clock className={`w-5 h-5 ${
          timerState === 'warning' ? 'text-warning' : 
          'text-foreground-muted'
        }`} />
                
        <div className={getTimerStyles()}>
          {secondsLeft}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-foreground-muted/10 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            timerState === 'warning' ? 'bg-warning' :
            'bg-primary'
          }`}
          style={{
            width: `${(secondsLeft / initialTime) * 100}%`
          }}
        />
      </div>
    </div>
  );
}