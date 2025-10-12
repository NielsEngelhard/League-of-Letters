import { DbGameRound } from "@/drizzle/schema";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { WordAndDefinition } from "@/features/word/word-models";
import {v4 as uuid} from 'uuid';

export interface CreateGameRoundData {
    gameId: string;
    word: WordAndDefinition;
    roundNumber: number;
    firstLetterIsGuessed: boolean;
    currentGuessMaxUtcDate?: Date | null;
}

export interface CreateGameRoundsData {
    gameId: string;
    words: WordAndDefinition[];
    firstLetterIsGuessed: boolean;
    currentGuessMaxUtcDate?: Date | null;
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
            currentGuessMaxUtcDate: data.roundNumber == 1 ? data.currentGuessMaxUtcDate ?? null : null,
            wordLength: data.word.word.length,
            previouslyMisplacedLetters: []
        }
    }

    static createDbRounds(data: CreateGameRoundsData): DbGameRound[] {
        return data.words.map((word, i) => this.createDbRound({
            gameId: data.gameId,
            word: word,
            roundNumber: i + 1,
            firstLetterIsGuessed: data.firstLetterIsGuessed,
            currentGuessMaxUtcDate: ((i+1) == 1) ? data.currentGuessMaxUtcDate : null
        }));
    }
}