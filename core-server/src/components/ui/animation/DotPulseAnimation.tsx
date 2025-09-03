import React from "react";

export default function DotPulseAnimation({label}: {label?: string}) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer ping ring */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-primary opacity-75 animate-ping"></div>
        {/* Middle pulsing ring */}
        <div className="absolute w-10 h-10 rounded-full border-2 border-primary opacity-75 animate-ping [animation-delay:0.3s]"></div>
        {/* Inner dot (stable core) */}
        <div className="relative w-4 h-4 bg-primary rounded-full animate-pulse"></div>
      </div>

      {label && (
        <p className="text-sm font-medium text-primary animate-pulse tracking-wide mt-10">
          connecting to realtime server
        </p>        
      )}
    </div>
  );
}
