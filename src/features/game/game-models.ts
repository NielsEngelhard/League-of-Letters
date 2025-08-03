import { GameMode } from "@/drizzle/schema";
import { EvaluatedLetter, EvaluatedWord } from "../word/word-models";

export interface ActiveGameModel {
    id: string;
    wordLength: number;    
    totalRounds: number;
    currentRoundIndex: number;
    nGuessesPerRound: number;
    gameMode: GameMode;
    createdAt: Date;
    rounds: ActiveGameRoundModel[];
    players: ActiveGamePlayerModel[];
}

// Data that is send when the current round has ended
export interface RoundTransitionData {    
    currentWord: string;
    isEndOfGame: boolean;
    nextRoundFirstLetter?: string;    
}

export interface ActiveGameRoundModel {
    id: string;
    roundNumber: number;
    currentGuessIndex: number;
    guesses: EvaluatedWord[];
    guessedLetters: EvaluatedLetter[];    
}

export interface ActiveGamePlayerModel {
    id: string;
    username: string;
    score: number;
    isConnected?: boolean;
}