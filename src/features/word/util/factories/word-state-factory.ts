import { WordState } from "../../word-models";

export class WordStateFactory {
    static create(word: string, firstLetterIsGuessed = true): WordState {
        return {
            word: word,
            letterStates: word.split('').map((letter, index) => {
                return {
                    guessed: firstLetterIsGuessed ? index == 0 : false,
                    letter: letter
                }
            })
        }
    }

    static createFromArray(words: string[]): WordState[] {
        return words.map((word, index) => {
            return this.create(word);
        });
    }
}