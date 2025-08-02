import { DbActiveGameRound } from "@/drizzle/schema";
import { WordStateFactory } from "@/features/word/util/factories/word-state-factory";
import { LetterState } from "@/features/word/word-models";
import {v4 as uuid} from 'uuid';

export class GameRoundFactory {
    static createDbRound(word: string, roundNumber: number, gameId: string): DbActiveGameRound {
        return {
            id: uuid(),
            word: WordStateFactory.create(word),
            roundNumber: roundNumber,
            currentGuessIndex: 0,
            gameId: gameId,
            guesses: [],
            evaluatedLetters: [{ position: 1, state: LetterState.Correct, letter: word[0].toUpperCase() }]
        }
    }

    static createDbRounds(words: string[], gameId: string): DbActiveGameRound[] {
        return words.map((word, index) => {
            return this.createDbRound(word, index + 1, gameId);
        });
    }
}