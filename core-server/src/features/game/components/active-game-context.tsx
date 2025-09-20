'use client';

import { createContext, useState, ReactNode, useContext, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import { ActiveGameModel, GamePlayerModel, GameRoundModel, RoundTransitionData } from '../game-models';
import { GuessWordCommand, GuessWordResponse } from '../actions/command/guess-word-command';
import { TIME_BETWEEN_ROUNDS_MS } from '../game-constants';
import { useToaster } from '@/components/general/toaster/ToasterContext';
import { TurnTrackerAlgorithm } from '../util/algorithm/turn-tracker-algorithm/turn-tracker';
import { GetLetterAnimationDurationInMs } from '../util/game-time-calculators';
import { sortPlayerModelOnPositionAndGetUserIds } from '../util/player-sorting';
import { getSecondsBetweenNowAndUnixTimestampInSeconds } from '@/lib/time-util';
import { useSounds } from '@/lib/SoundPlayerContext';
import { EvaluatedWordFactory } from '@/features/word/util/factories/evaluated-word-factory';
import FinalizeRoundAfterSkip from '../actions/command/finalize-round-after-skip';

type ActiveGameContextType = {  
  // Data
  game: ActiveGameModel | undefined;  
  players: GamePlayerModel[];
  currentGuess: string;
  currentRound: GameRoundModel | undefined;
  currentPlayerId: string;
  isThisPlayersTurn: boolean;
  isAnimating: boolean;
  revealedWord?: string;

  // Actions
  initializeGameState: (_game: ActiveGameModel, _thisPlayersUserId: string) => void;
  submitGuess: () => Promise<boolean>;
  setCurrentGuess: Dispatch<SetStateAction<string>>;
  handleWordGuess: (response: GuessWordResponse) => void;
  clearGameState: () => void;
  addOrReconnectPlayer: (p: GamePlayerModel) => void;
  setInitialPlayers: (players: GamePlayerModel[]) => void;
  removePlayer: (playerId: string) => void;
  disconnectPlayer: (playerId: string) => void;
  recalculateCurrentPlayer: () => void;
  kickPlayer: (accountId: string) => void;
  skipCurrentGuess: () => void;
};

const ActiveGameContext = createContext<ActiveGameContextType | undefined>(undefined);

export function ActiveGameProvider({ children }: { children: ReactNode }) {
  const { errorToast, pushToast } = useToaster();
  const soundPlayer = useSounds();
  
  const [game, setGame] = useState<ActiveGameModel | undefined>(undefined);
  const [currentRound, setCurrentRound] = useState<GameRoundModel | undefined>(undefined);
  const [players, setPlayers] = useState<GamePlayerModel[]>([]);
  const [revealedWord, setRevealedWord] = useState<string | undefined>(undefined);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [isThisPlayersTurn, setIsThisPlayersTurn] = useState<boolean>(false);
  const [thisPlayersUserId, setThisPlayersUserId] = useState<string | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recalculateCurrentPlayerTrigger, setRecalculateCurrentPlayerTrigger] = useState(false);

  const gameRef = useRef<ActiveGameModel | undefined>(undefined);
  const currentRoundRef = useRef<GameRoundModel | undefined>(undefined);
  const currentGuessRef = useRef(currentGuess);
  const playersRef = useRef(players);

  // keep ref in sync with state
  useEffect(() => {
    currentGuessRef.current = currentGuess;
  }, [currentGuess]);

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
    setCurrentGuess("");
    setPlayers([]); 
    setRevealedWord(undefined);
  }


  // Keep refs in sync with state
  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);  

  useEffect(() => {
    playersRef.current = players;
  }, [players]);  

  async function submitGuess(): Promise<boolean> {
    if (!game || !currentRound) return false;
    if (currentGuessRef.current?.length != currentRound.wordLength) return false;

    const serverResponse = await GuessWordCommand({
        gameId: game.id,
        word: currentGuessRef.current,
        language: game.language
    });

    if (!serverResponse.ok || !serverResponse.data) {
      errorToast(serverResponse.errorMsg);
      return false;
    } else {
      handleWordGuess(serverResponse.data);
      return true;
    }
  }

  function handleWordGuess(response: GuessWordResponse) {    
    setCurrentGuess("");

    addGuessToCurrentRound(response);

    const letterAnimationDuration = GetLetterAnimationDurationInMs(response.guessResult.evaluatedLetters.length);
    setIsAnimating(true);

    setTimeout(() => {
      if (response.roundTransitionData) {
        updatePlayerScores(response);
        handleEndOfCurrentRound(response.roundTransitionData);
      } else {
        updatePlayerScores(response);
        updateCurrentRoundWithGuess(response);
        setIsAnimating(false);
      }      
    }, letterAnimationDuration);
  }

  function updatePlayerScores(response: GuessWordResponse) {
    setPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.accountId === response.accountId
          ? { ...player, score: player.score + response.score }
          : player
      )
    );       
  }

  function kickPlayer(accountId: string) {
    const playerToRemove = playersRef.current.find(p => p.accountId == accountId);
    if (!playerToRemove) return;

    pushToast({ msg: `${playerToRemove.username} kicked`, type: "information" });
    removePlayer(accountId);
  }

  function addGuessToCurrentRound(response: GuessWordResponse) {
    setCurrentRound(prevRound => {
      if (prevRound == null) return;

      return {
        ...prevRound,
        guesses: [...prevRound.guesses, response.guessResult],        
      };
    });
  }

  function updateCurrentRoundWithGuess(guessWordResponse: GuessWordResponse) {
      setCurrentRound(prevRound => {
        if (prevRound == null) return;

        return {
          ...prevRound,
          currentGuessIndex: prevRound.currentGuessIndex + 1,
          lastGuessUnixUtcTimestamp_InSeconds: guessWordResponse?.unixTimestampInSeconds,
          unguessedMisplacedLetters: guessWordResponse.unguessedMisplacedLetters
        };
      });    
  }

  function handleEndOfCurrentRound(roundTransitionData: RoundTransitionData) {    
    if (!gameRef.current || !currentRoundRef.current) return;

    setRevealedWord(roundTransitionData.currentWord);

    if (roundTransitionData.isEndOfGame)
    {
      setTimeout(() => {
          triggerEndOfGame();
        }, TIME_BETWEEN_ROUNDS_MS);
    }
    else
    {
      setTimeout(() => {
          debugger;
          triggerNextRound(roundTransitionData.lastGuessUnixUtcTimestamp_InSeconds);
        }, TIME_BETWEEN_ROUNDS_MS);          
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

  function triggerNextRound(guessStartUnixTimestampInSeconds?: number) {
    if (!gameRef.current) return;
    const nextRoundIndex: number = gameRef.current.currentRoundIndex + 1;

    setGame(g => {
      if (!g) return;      
      return {
        ...g,
        currentRoundIndex: nextRoundIndex,
      }
    });

    setCurrentRound({
      ...getRound(gameRef.current, nextRoundIndex),
      lastGuessUnixUtcTimestamp_InSeconds: guessStartUnixTimestampInSeconds
    });
    setRevealedWord(undefined);
    setIsAnimating(false);
  }

  function getRound(_game: ActiveGameModel, index?: number): GameRoundModel {
    if (!index) index = _game.currentRoundIndex; 

    const round = _game.rounds.find(r => r.roundNumber == index);
    if (!round) throw Error("Could not find current round CORRUPT STATE");
    return round;
  }

  function determineCurrentPlayer() {
    if (!game || !currentRound) return;

    if (game.gameMode == "solo") {
      setIsThisPlayersTurn(true);
      return;
    }

    const sortedPlayerIds = sortPlayerModelOnPositionAndGetUserIds(game.players);
    const resp = TurnTrackerAlgorithm.determineWhosTurnItIs({
      playerIdsInOrder: sortedPlayerIds,
      currentGuess: currentRound.currentGuessIndex,
      currentRound: game.currentRoundIndex,
      secondsBetweenLastGuess: getSecondsBetweenNowAndUnixTimestampInSeconds(currentRound.lastGuessUnixUtcTimestamp_InSeconds),
      secondsPerGuess: game.nSecondsPerGuess
    });

    const currentPlayerIdChanged = currentPlayerId != resp.currentPlayerAccountId;

    if (currentPlayerIdChanged) {
      setCurrentPlayerId(resp.currentPlayerAccountId);
      setIsThisPlayersTurn(thisPlayersUserId == resp.currentPlayerAccountId);
      setCurrentGuess("");
    }
  }

  // Determine the current player whos turn it is
  useEffect(() => {
    if (!game || !currentRound) return;
    determineCurrentPlayer();
  }, [recalculateCurrentPlayerTrigger, game?.currentRoundIndex, currentRound?.currentGuessIndex]);

  function recalculateCurrentPlayer() {
    setRecalculateCurrentPlayerTrigger(prev => !prev);
  }

  function addOrReconnectPlayer(player: GamePlayerModel) {
    setPlayers(prev => {
      const playerExists = prev.some(p => p.accountId === player.accountId);

      if (playerExists) {
        return prev.map(p => p.accountId == player.accountId ? {...p, connectionStatus: "connected"} : p);
      }

      return [...prev, player];
    });
  }

  function setInitialPlayers(players: GamePlayerModel[]) {
    setPlayers(players);
  }

  function removePlayer(accountId: string) {
    setPlayers(prev => prev.filter(p => p.accountId != accountId));
  }

  function disconnectPlayer(playerId: string) {
    setPlayers(prev => prev.map(player => player.accountId == playerId ? {...player, connectionStatus: "disconnected"} : player));
  }

  async function skipCurrentGuess() {
    if (!game) return;

    const isLastGuess: boolean = currentRound?.currentGuessIndex == game?.nGuessesPerRound;

    if (isLastGuess) {
      await HandleFinalizeRoundRequest();
      return;
    }

    // Add skipped guess to list and go to next guess
    setCurrentRound(prev => {
      if (!prev || ! currentRound) return prev;

      // Add skipped guess
      const skippedGuess = EvaluatedWordFactory.createSkipped(currentRound?.wordLength, 1);
      return {
        ...prev,
        guesses: [
          ...prev.guesses,
          skippedGuess
        ],
        currentGuessIndex: prev.currentGuessIndex + 1 // Update current guess index
      };
    });
  }

  async function HandleFinalizeRoundRequest() {
    if (!game) return;

    const response = await FinalizeRoundAfterSkip(game.id);
    if (response == null) return;
    
    handleWordGuess(response);
  }

  // BEGIN sound effects

  // Play sound effect for game is over
  useEffect(() => {
    if (game?.gameIsOver != true) return;

    soundPlayer.playEffect("game-over");
  }, [game?.gameIsOver]);  

  // END sound effects

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
        removePlayer,
        revealedWord,
        recalculateCurrentPlayer,
        setInitialPlayers,
        kickPlayer,
        skipCurrentGuess,
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
