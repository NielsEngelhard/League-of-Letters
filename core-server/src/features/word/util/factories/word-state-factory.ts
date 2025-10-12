import { WordAndDefinition, WordState } from "../../word-models";
import { WordFormatValidator } from "../word-format-validator/word-format-validator";

export class WordStateFactory {
    static create(word: WordAndDefinition, firstLetterIsGuessed = true): WordState {
        const strippedWord = WordFormatValidator.replaceSpecialCharacters(word.word).toUpperCase();
        
        return {
            originalWord: word.word.toUpperCase(),
            strippedWord: strippedWord,
            definition: word.definition ?? undefined,
            letterStates: strippedWord.split('').map((letter, index) => {
                return {
                    guessed: firstLetterIsGuessed ? index == 0 : false,
                    letter: letter
                }
            })
        }
    }

    static createFromArray(words: WordAndDefinition[]): WordState[] {
        return words.map((word) => {
            return this.create(word);
        });
    }
}