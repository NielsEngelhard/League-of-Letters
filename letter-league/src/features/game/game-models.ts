import { GameMode } from "@/drizzle/schema";
import { EvaluatedLetter, EvaluatedWord } from "../word/word-models";
import { ConnectionStatus } from "../realtime/realtime-models";

export interface ActiveGameModel {
    id: string;    
    totalRounds: number;
    currentRoundIndex: number;
    nGuessesPerRound: number;
    gameMode: GameMode;
    createdAt: Date;
    rounds: GameRoundModel[];
    players: GamePlayerModel[];
    gameIsOver: boolean;
    hostAccountId: string;
    nSecondsPerGuess?: number | null;
}

// Data that is send when the current round has ended
export interface RoundTransitionData {    
    currentWord: string;
    isEndOfGame: boolean;
    nextRoundFirstLetter?: string;
    lastGuessUnixUtcTimestamp_InSeconds?: number; 
}

export interface GameRoundModel {
    id: string;
    roundNumber: number;
    currentGuessIndex: number;
    guesses: EvaluatedWord[];
    guessedLetters: EvaluatedLetter[];
    wordLength: number;
    lastGuessUnixUtcTimestamp_InSeconds?: number;
}

export interface GamePlayerModel {
    accountId: string;
    isHost: boolean;
    username: string;
    score: number;
    connectionStatus: ConnectionStatus;
    position: number;
}
