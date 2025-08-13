'use client';

import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { ActiveGameModel, GamePlayerModel, GameRoundModel, RoundTransitionData } from '../game-models';
import { GuessWordCommand, GuessWordResponse } from '../actions/command/guess-word-command';
import { TIME_BETWEEN_ROUNDS_MS } from '../game-constants';
import { useMessageBar } from '@/components/layout/MessageBarContext';
import { TurnTrackerAlgorithm } from '../util/algorithm/turn-tracker-algorithm/turn-tracker';
import { GetLetterAnimationDurationInMs } from '../util/game-time-calculators';

type ActiveGameContextType = {  
  // Data
  game: ActiveGameModel | undefined;  
  players: GamePlayerModel[];
  currentGuess: string | undefined;
  currentRound: GameRoundModel | undefined;
  currentPlayerId: string;
  isThisPlayersTurn: boolean;
  isAnimating: boolean;

  // Actions
  initializeGameState: (_game: ActiveGameModel, _thisPlayersUserId: string) => void;
  submitGuess: (secretKey: string) => Promise<void>;
  setCurrentGuess: (guess: string) => void;
  handleWordGuess: (response: GuessWordResponse) => void;
  clearGameState: () => void;
  addOrReconnectPlayer: (p: GamePlayerModel) => void;
  removePlayer: (playerId: string) => void;
  disconnectPlayer: (playerId: string) => void;
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Always call this first
  function initializeGameState(_game: ActiveGameModel, _thisPlayersUserId: string) {
    setGame(_game);
    setPlayers(_game.players);

    const _currentRound = getRound(_game);
    setCurrentRound(_currentRound);
    setThisPlayersUserId(_thisPlayersUserId);
  }

  function clearGameState() {
    setGame(undefined);
    setCurrentRound(undefined);
    setCurrentGuess(undefined);
    setPlayers([]); 
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
    setCurrentGuess(undefined);

    addGuessToCurrentRound(response);

    const letterAnimationDuration = GetLetterAnimationDurationInMs(response.guessResult.evaluatedLetters.length);
    setIsAnimating(true);

    setTimeout(() => {
      if (response.roundTransitionData) {
        updatePlayerScores(response);
        handleEndOfCurrentRound(response.roundTransitionData);
      } else {
        // TODO: after animation
        updatePlayerScores(response);
        incrementCurrentGuessIndex();
      }

      setIsAnimating(false);
    }, letterAnimationDuration);
  }

  function updatePlayerScores(response: GuessWordResponse) {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.userId === response.userId
          ? { ...player, score: player.score + response.scoreResult.totalScore }
          : player
      )
    );       
  }

  function addGuessToCurrentRound(response: GuessWordResponse) {
    setCurrentRound(prevRound => {
      if (prevRound == null) return;

      return {
        ...prevRound,
        guesses: [...prevRound.guesses, response.guessResult],
        guessedLetters: [...prevRound.guessedLetters, ...response.newLetters],
      };
    });
  }

  function incrementCurrentGuessIndex() {
      setCurrentRound(prevRound => {
        if (prevRound == null) return;

        return {
          ...prevRound,
          currentGuessIndex: prevRound.currentGuessIndex + 1
        };
      });    
  }

  function handleEndOfCurrentRound(roundTransitionData: RoundTransitionData) {
    if (!game) return;

    const letterAnimationLength = GetLetterAnimationDurationInMs(game.wordLength);

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

  function determineCurrentPlayer() {
    if (!game || !currentRound) return;
    
    const playerId = TurnTrackerAlgorithm.determineWhosTurnItIs(game.players.sort(p => p.position).map(p => p.userId), game.currentRoundIndex, currentRound.currentGuessIndex);
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

  function addOrReconnectPlayer(player: GamePlayerModel) {
    setPlayers(prev => {
      const playerExists = prev.some(p => p.userId === player.userId);

      if (playerExists) {
        return prev.map(player => player.userId == player.userId ? {...player, connectionStatus: "connected"} : player);
      }

      return [...prev, player];
    });
  }

  function removePlayer(playerId: string) {
    setPlayers(prev => prev.filter(p => p.userId != playerId));
  }

  function disconnectPlayer(playerId: string) {
    setPlayers(prev => prev.map(player => player.userId == playerId ? {...player, connectionStatus: "disconnected"} : player));
  }

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
        isThisPlayersTurn,
        isAnimating,
        clearGameState,
        addOrReconnectPlayer,
        disconnectPlayer,
        removePlayer
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
