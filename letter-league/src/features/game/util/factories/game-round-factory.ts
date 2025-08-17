import { DbGameRound } from "@/drizzle/schema";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { LetterState } from "@/features/word/word-models";
import { getCurrentUtcUnixTimestamp_Seconds } from "@/lib/time-util";
import {v4 as uuid} from 'uuid';

export interface CreateGameRoundData {
    gameId: string;
    word: string;
    roundNumber: number;
    hasTimePerGuess: boolean;    
}

export interface CreateGameRoundsData {
    gameId: string;
    words: string[];
    hasTimePerGuess: boolean;
}

export class GameRoundFactory {
    static createDbRound(data: CreateGameRoundData): DbGameRound {
        const unixTimestampInSeconds = (data.hasTimePerGuess && data.roundNumber == 1)
            ? getCurrentUtcUnixTimestamp_Seconds()
            : null;

        return {
            id: uuid(),
            word: WordStateFactory.create(data.word),
            roundNumber: data.roundNumber,
            currentGuessIndex: 1,
            gameId: data.gameId,
            guesses: [],
            evaluatedLetters: [{ position: 1, state: LetterState.Correct, letter: data.word[0].toUpperCase() }],
            lastGuessUnixUtcTimestamp_InSeconds: unixTimestampInSeconds,
            wordLength: data.word.length,
        }
    }

    static createDbRounds(data: CreateGameRoundsData): DbGameRound[] {
        return data.words.map((word, i) => this.createDbRound({
            gameId: data.gameId,
            word: word,
            roundNumber: i + 1,
            hasTimePerGuess: data.hasTimePerGuess,
        }));
    }
}