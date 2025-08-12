'use client';

import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { ActiveGameModel, GamePlayerModel, GameRoundModel, RoundTransitionData } from '../game-models';
import { GuessWordCommand, GuessWordCommandInput, GuessWordResponse } from '../actions/command/guess-word-command';
import { LETTER_ANIMATION_TIME_MS, TIME_BETWEEN_ROUNDS_MS } from '../game-constants';
import { useMessageBar } from '@/components/layout/MessageBarContext';
import { DetermineCurrentPlayerAlgorithm } from '../util/current-players-turn-calculator';
import { useAuth } from '@/features/auth/AuthContext';

type ActiveGameContextType = {  
  // Data
  game: ActiveGameModel | undefined;  
  players: GamePlayerModel[];
  currentGuess: string | undefined;
  currentRound: GameRoundModel | undefined;
  currentPlayerId: string;
  isThisPlayersTurn: boolean;

  // Actions
  initializeGameState: (_game: ActiveGameModel, _thisPlayersUserId: string) => void;
  submitGuess: (secretKey: string) => Promise<void>;
  setCurrentGuess: (guess: string) => void;
  handleWordGuess: (response: GuessWordResponse) => void;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children }: { children: ReactNode }) {
  const { pushErrorMsg } = useMessageBar();

  const [game, setGame] = useState<ActiveGameModel | undefined>(undefined);
  const [currentRound, setCurrentRound] = useState<GameRoundModel | undefined>(undefined);
  const [players, setPlayers] = useState<GamePlayerModel[]>([]);
  const [theWord, setTheWord] = useState<string | undefined>(undefined);
  const [currentGuess, setCurrentGuess] = useState<string | undefined>(undefined);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [isThisPlayersTurn, setIsThisPlayersTurn] = useState<boolean>(false);
  const [thisPlayersUserId, setThisPlayersUserId] = useState<string | undefined>(undefined);

  // Always call this first
  function initializeGameState(_game: ActiveGameModel, _thisPlayersUserId: string) {
    setGame(_game);
    setPlayers(_game.players);

    const _currentRound = getRound(_game);
    setCurrentRound(_currentRound);
    setThisPlayersUserId(_thisPlayersUserId);
  }

  async function submitGuess(secretKey: string): Promise<void> {
    if (!game || !currentRound) return;
    if (currentGuess?.length != game.wordLength) throw Error("GUESS LENGTH DOES NOT MATCH");

    const serverResponse = await GuessWordCommand({
        gameId: game.id,
        secretKey: secretKey,
        word: currentGuess
    });

    if (!serverResponse.ok || !serverResponse.data) {
      pushErrorMsg(serverResponse.errorMsg);
      return;
    } else {
      handleWordGuess(serverResponse.data);
    }
  }

  function handleWordGuess(response: GuessWordResponse) {
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
    } else {
      // TODO: set next round for currentGuess
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

  // TODO: this can be a static method somewhere else
  function getRound(_game: ActiveGameModel, index?: number): GameRoundModel {
    if (!index) index = _game.currentRoundIndex; 

    const round = _game.rounds.find(r => r.roundNumber == index);
    if (!round) throw Error("Could not find current round CORRUPT STATE");
    return round;
  }

  // TODO: this can be a static method somewhere else
  function determineCurrentPlayer() {
    if (!game || !currentRound) return;

    const playerId = DetermineCurrentPlayerAlgorithm.execute(game.players.map(p => p.userId), game.currentRoundIndex, currentRound.currentGuessIndex);
    setCurrentPlayerId(playerId);
    setIsThisPlayersTurn(thisPlayersUserId == playerId);
  }

  // Determine the current player whos turn it is
  useEffect(() => {
    if (!game || !currentRound) return;

    console.log("THE CURRENT PLAYERS TURN IS GETTING RE DETERMINED");
    console.log("EVEN KIJKEN OF DIT NIET GESPAMMED WORDT!!!!!!!!!!");
    determineCurrentPlayer();

  }, [game?.currentRoundIndex, currentRound?.currentGuessIndex]);

  useEffect(() => {
    console.log("kkk " + currentGuess);
  }, [currentGuess])

  return (
    <ActiveGameContext.Provider value={{        
        initializeGameState,
        game,
        currentGuess,
        currentRound,
        players,
        setCurrentGuess,
        submitGuess,
        currentPlayerId,
        handleWordGuess,
        isThisPlayersTurn
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
