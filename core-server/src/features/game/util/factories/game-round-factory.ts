import { DbGameRound } from "@/drizzle/schema";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { getCurrentUtcDate } from "@/lib/time-util";
import {v4 as uuid} from 'uuid';

export interface CreateGameRoundData {
    gameId: string;
    word: string;
    roundNumber: number;
    hasTimePerGuess: boolean;
    firstLetterIsGuessed: boolean;
}

export interface CreateGameRoundsData {
    gameId: string;
    words: string[];
    hasTimePerGuess: boolean;
    firstLetterIsGuessed: boolean;
}

export class GameRoundFactory {
    static createDbRound(data: CreateGameRoundData): DbGameRound {
        return {
            id: uuid(),
            word: WordStateFactory.create(data.word, data.firstLetterIsGuessed),
            roundNumber: data.roundNumber,
            currentGuessIndex: 1,
            gameId: data.gameId,
            guesses: [],
            lastGuessUtcDate: data.roundNumber == 1 ? getCurrentUtcDate() : null,
            wordLength: data.word.length,
            previouslyMisplacedLetters: []
        }
    }

    static createDbRounds(data: CreateGameRoundsData): DbGameRound[] {
        return data.words.map((word, i) => this.createDbRound({
            gameId: data.gameId,
            word: word,
            roundNumber: i + 1,
            hasTimePerGuess: data.hasTimePerGuess,
            firstLetterIsGuessed: data.firstLetterIsGuessed
        }));
    }
}