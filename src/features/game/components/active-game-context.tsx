'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

const ACTIVE_GAME_ID_LOCALSTORAGE_KEY: string = "active-game-id";

type ActiveGameContextType = {  
  getGameId: () => string | null;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children }: { children: ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    console.log("in active game context");
  }, []);

  const getGameId = (): string | null => {
    return null;
  }

  return (
    <ActiveGameContext.Provider value={{ getGameId }}>
      {children}
    </ActiveGameContext.Provider>
  );
}

export function useActiveGame() {
  const context = useContext(ActiveGameContext);
  if (context === undefined) {
    throw new Error('useActiveGame must be used within an ActiveGameProvider');
  }
  return context;
}
