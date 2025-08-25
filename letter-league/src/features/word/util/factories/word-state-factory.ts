import { WordState } from "../../word-models";
import { WordFormatValidator } from "../word-format-validator/word-format-validator";

export class WordStateFactory {
    static create(word: string, firstLetterIsGuessed = true): WordState {
        const strippedWord = WordFormatValidator.replaceSpecialCharacters(word);
        
        return {
            originalWord: word,
            strippedWord: strippedWord,
            letterStates: strippedWord.split('').map((letter, index) => {
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