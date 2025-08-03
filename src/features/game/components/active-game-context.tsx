'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { ActiveGameModel } from '../game-models';

const ACTIVE_GAME_ID_LOCALSTORAGE_KEY: string = "active-game-id";

type ActiveGameContextType = {  
  activeGame: ActiveGameModel;
  getGameId: () => string | null;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children, _activeGame }: { children: ReactNode, _activeGame: ActiveGameModel }) {
  const [activeGame, setActiveGame] = useState<ActiveGameModel>(_activeGame);
  const [gameId, setGameId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    console.log("in active game context");
  }, []);

  const getGameId = (): string | null => {
    return null;
  }

  return (
    <ActiveGameContext.Provider value={{ getGameId, activeGame }}>
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
