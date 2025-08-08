import { GameMode } from "@/drizzle/schema";
import { EvaluatedLetter, EvaluatedWord } from "../word/word-models";
import { ConnectionStatus } from "../realtime/realtime-models";

export interface ActiveGameModel {
    id: string;
    wordLength: number;    
    totalRounds: number;
    currentRoundIndex: number;
    nGuessesPerRound: number;
    gameMode: GameMode;
    createdAt: Date;
    rounds: GameRoundModel[];
    players: GamePlayerModel[];
}

// Data that is send when the current round has ended
export interface RoundTransitionData {    
    currentWord: string;
    isEndOfGame: boolean;
    nextRoundFirstLetter?: string;    
}

export interface GameRoundModel {
    id: string;
    roundNumber: number;
    currentGuessIndex: number;
    guesses: EvaluatedWord[];
    guessedLetters: EvaluatedLetter[];    
}

export interface GamePlayerModel {
    userId: string;
    isHost: boolean;
    username: string;
    score: number;
    connectionStatus: ConnectionStatus;
}

export interface GameLobbyModel {
    id: string;
    players: GamePlayerModel[];
}
