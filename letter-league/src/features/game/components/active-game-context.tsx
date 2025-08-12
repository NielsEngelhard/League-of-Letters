'use client';

import { createContext, useState, ReactNode, useContext } from 'react';
import { ActiveGameModel, GamePlayerModel, GameRoundModel, RoundTransitionData } from '../game-models';
import { GuessWordCommand } from '../actions/command/guess-word-command';
import { LETTER_ANIMATION_TIME_MS, TIME_BETWEEN_ROUNDS_MS } from '../game-constants';

type ActiveGameContextType = {  
  // Data
  game: ActiveGameModel | undefined;  
  players: GamePlayerModel[];
  currentGuess: string | undefined;
  currentRound: GameRoundModel | undefined;

  // Actions
  initializeGameState: (_game: ActiveGameModel) => void;
  submitGuess: (secretKey: string) => Promise<void>;
  setCurrentGuess: (guess: string) => void;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<ActiveGameModel | undefined>(undefined);
  const [currentRound, setCurrentRound] = useState<GameRoundModel | undefined>(undefined);
  const [players, setPlayers] = useState<GamePlayerModel[]>([]);
  const [theWord, setTheWord] = useState<string | undefined>(undefined);
  const [currentGuess, setCurrentGuess] = useState<string | undefined>(undefined);

  // Always call this first
  function initializeGameState(_game: ActiveGameModel) {
    setGame(_game);
    setPlayers(_game.players);
    setCurrentRound(getRound(_game));
  }

  async function submitGuess(secretKey: string): Promise<void> {
    if (!game || !currentRound) return;
    if (currentGuess?.length != game.wordLength) throw Error("GUESS LENGTH DOES NOT MATCH");

    // TODO: use generic server response HERE
    const response = await GuessWordCommand({
        gameId: game.id,
        secretKey: secretKey,
        word: currentGuess
    });

    // Update current round
      setCurrentRound(prevRound => {
        if (prevRound == null) return;

        return {
          ...prevRound,
          guesses: [...prevRound.guesses, response.guessResult],
          guessedLetters: [...prevRound.guessedLetters, ...response.newLetters]
        };
      });

    // Update player score(s)
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.userId === response.userId
          ? { ...player, score: player.score + response.scoreResult.totalScore }
          : player
      )
    );   

    if (response.roundTransitionData) {
      handleEndOfCurrentRound(response.roundTransitionData);
    }        
  }

  function handleEndOfCurrentRound(roundTransitionData: RoundTransitionData) {
    if (!game) return;

    const letterAnimationLength = LETTER_ANIMATION_TIME_MS * game.wordLength;


    setTimeout(() => {
      setTheWord(roundTransitionData.currentWord);
    }, letterAnimationLength);

    if (roundTransitionData.isEndOfGame)
    {
      setTimeout(() => {
          triggerEndOfGame();
        }, TIME_BETWEEN_ROUNDS_MS + letterAnimationLength);          
    }
    else
    {
      setTimeout(() => {
          triggerNextRound();
        }, TIME_BETWEEN_ROUNDS_MS + letterAnimationLength);          
    }
  }

  function triggerEndOfGame() {
    setGame(g => {
      if (!g) return;

      return {
        ...g,
        gameIsOver: true
      }
    });
  }  

  function triggerNextRound() {
    if (!game) return;
    const nextRoundIndex: number = game.currentRoundIndex + 1;

    setGame(g => {
      if (!g) return;      
      return {
        ...g,
        currentRoundIndex: nextRoundIndex,
      }
    });

    setCurrentRound(getRound(game, nextRoundIndex));
    setTheWord(undefined);
  }

  function getRound(_game: ActiveGameModel, index?: number): GameRoundModel {
    if (!index) index = _game.currentRoundIndex; 

    const round = _game.rounds.find(r => r.roundNumber == index);
    if (!round) throw Error("Could not find current round CORRUPT STATE");
    return round;
  }  

  return (
    <ActiveGameContext.Provider value={{        
        initializeGameState,
        game,
        currentGuess,
        currentRound,
        players,
        setCurrentGuess,
        submitGuess
       }}>
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
