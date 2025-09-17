import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock } from 'lucide-react';

interface InGameTimerProps {
  timePerTurn: number;
  initialTime: number; // in seconds
  onTimerEnd?: () => void;
  isPaused?: boolean;
  warningThreshold?: number; // seconds when to show warning state
  // Add a unique key to force timer reset when turn changes
  turnKey?: string;
}

export default function InGameTimer({
  timePerTurn,
  initialTime,
  onTimerEnd,
  warningThreshold = 7,
  isPaused = false,
  turnKey
}: InGameTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialTime);
  const hasEndedRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTurnKeyRef = useRef(turnKey);

  // Reset timer when turnKey changes (more reliable than initialTime)
  useEffect(() => {
    if (turnKey !== lastTurnKeyRef.current) {
      setSecondsLeft(initialTime);
      hasEndedRef.current = false;
      lastTurnKeyRef.current = turnKey;
    }
  }, [turnKey, initialTime]);

  // Get timer state for styling
  const getTimerState = useCallback(() => {
    if (secondsLeft <= warningThreshold) return 'warning';
    return 'normal';
  }, [secondsLeft, warningThreshold]);

  // Timer logic
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPaused && secondsLeft > 0 && !hasEndedRef.current) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          
          // Check if timer just ended and hasn't been handled yet
          if (newTime <= 0 && !hasEndedRef.current) {
            hasEndedRef.current = true;
            // Use requestAnimationFrame for better timing
            requestAnimationFrame(() => {
              if (onTimerEnd) onTimerEnd();
            });
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused, secondsLeft, onTimerEnd]);

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
    <div className="w-full flex flex-row gap-1 items-center text-foreground-muted">
      <Clock size={14} />
      
      {/* Progress Bar */}
      <div className="w-full max-w-xs bg-foreground-muted/10 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${
            timerState === 'warning' ? 'bg-warning' : 'bg-primary'
          }`}
          style={{
            width: `${Math.max(0, (secondsLeft / timePerTurn) * 100)}%`
          }}
        />
      </div>
    </div>
  );
}