'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { ActiveGameModel, ActiveGamePlayerModel, ActiveGameRoundModel } from '../game-models';
import { GuessWordCommand } from '../actions/command/guess-word-command';
import { LETTER_ANIMATION_TIME_MS, TIME_BETWEEN_ROUNDS_MS } from '../game-constants';

type ActiveGameContextType = {  
  getGameId: () => string | null;
  submitGuess: (guess: string, secretKey: string) => Promise<void>;
  currentRoundIndex: number;
  totalRounds: number;
  wordLength: number;
  currentRound: ActiveGameRoundModel;
  maxAttemptsPerRound: number;
  ended: boolean;
  players: ActiveGamePlayerModel[];
  currentPlayer: ActiveGamePlayerModel | null;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children, game }: { children: ReactNode, game: ActiveGameModel }) {
    const [currentRoundIndex, setCurrentRoundIndex] = useState(game.currentRoundIndex);
    const [rounds, setRounds] = useState<ActiveGameRoundModel[]>(game.rounds);
    const [currentRound, setCurrentRound] = useState<ActiveGameRoundModel>(getRound());
    const [currentGuessIndex, setCurrentGuessIndex] = useState(currentRound.currentGuessIndex);
    const [theWord, setTheWord] = useState<string | undefined>(undefined);
    const [players, setPlayers] = useState<ActiveGamePlayerModel[]>(game.players);
    const [ended, setEnded] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<ActiveGamePlayerModel | null>(null);

    const gameId = game.id;
    const totalRounds =  game.totalRounds;
    const maxAttemptsPerRound =  game.nGuessesPerRound;
    const gameMode =  game.gameMode;
    const createdAt =  game.createdAt;
    const wordLength =  game.wordLength;

  // Check for existing session on mount
  useEffect(() => {
    // console.log("in active game context");
  }, []);

  const getGameId = (): string | null => {
    return null;
  }

  async function submitGuess(guess: string, secretKey: string): Promise<void> {
    if (guess.length != wordLength) return;

    const response = await GuessWordCommand({
        gameId: gameId,
        secretKey: secretKey,
        word: guess
    });

    // Update current round
    setCurrentRound(prevRound => ({
      ...prevRound,
      guesses: [...prevRound.guesses, response.guessResult],
      guessedLetters: [...currentRound.guessedLetters, ...response.newLetters]
    }));

    // Update player score(s)
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === response.userId
          ? { ...player, score: player.score + response.scoreResult.totalScore }
          : player
      )
    );   
    
      setCurrentGuessIndex(currentGuessIndex + 1);

      const letterAnimationLength = LETTER_ANIMATION_TIME_MS * wordLength;

      const endOfCurrentRound = response.roundTransitionData != undefined;
      if (endOfCurrentRound) {
        setTimeout(() => {
          setTheWord(response.roundTransitionData?.currentWord);
        }, letterAnimationLength);

        if (response.roundTransitionData?.isEndOfGame)
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
  }

    function triggerEndOfGame() {
      setEnded(true);
    }  

    function triggerNextRound() {
      const nextRoundIndex = currentRoundIndex + 1;
      
      setCurrentGuessIndex(1);
      setCurrentRoundIndex(nextRoundIndex);
      setCurrentRound(getRound(nextRoundIndex));
      setTheWord(undefined);
    }  

    function getRound(index?: number): ActiveGameRoundModel {
      if (!index) index = currentRoundIndex; 

      const round = rounds.find(r => r.roundNumber == index);
      if (!round) throw Error("Could not find current round CORRUPT STATE");
      return round;
    }  

  return (
    <ActiveGameContext.Provider value={{ getGameId, submitGuess, currentRoundIndex, totalRounds, currentRound, maxAttemptsPerRound, wordLength, ended, players, currentPlayer }}>
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
