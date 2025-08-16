import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  initialTime?: number; // in seconds
  onTimerEnd?: () => void;
  isPaused?: boolean;
  showControls?: boolean;
  warningThreshold?: number; // seconds when to show warning state
  criticalThreshold?: number; // seconds when to show critical state
}

export default function CountdownTimer({
  initialTime = 60,
  onTimerEnd,
  warningThreshold = 10,
  criticalThreshold = 5,
  isPaused = false
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialTime);

  // Get timer state for styling
  const getTimerState = useCallback(() => {
    if (secondsLeft <= criticalThreshold) return 'critical';
    if (secondsLeft <= warningThreshold) return 'warning';
    return 'normal';
  }, [secondsLeft, criticalThreshold, warningThreshold]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (!isPaused && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prevTime) => {
          const newTime = prevTime - 1;
          
          if (newTime <= 0) {
            onTimerEnd?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, secondsLeft, onTimerEnd]);

  const timerState = getTimerState();

  // Dynamic styling based on timer state
  const getTimerStyles = () => {
    const baseStyles = "font-mono font-bold transition-all duration-300 text-xl sm:text-2xl";
    
    switch (timerState) {
      case 'critical':
        return `${baseStyles} text-error animate-pulse`;
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
          timerState === 'critical' ? 'text-error' : 
          timerState === 'warning' ? 'text-warning' : 
          'text-foreground-muted'
        }`} />
        
        <div className={getTimerStyles()}>
          {secondsLeft}
        </div>
        
        {secondsLeft === 0 && (
          <span className="text-sm text-error font-medium">Time's up!</span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-foreground-muted/10 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            timerState === 'critical' ? 'bg-error' :
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
