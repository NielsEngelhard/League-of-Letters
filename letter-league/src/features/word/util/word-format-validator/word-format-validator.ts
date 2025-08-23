import { ALLOWED_WORD_CHARACTERS, MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "@/features/game/game-constants";

export interface ValidateWordFormatResponse {
    word: string;
    isValid: boolean;
}

export class WordFormatValidator {
    static validateFormat(word: string): ValidateWordFormatResponse {
        const trimmedWord = word.trim().toUpperCase();

        // Valid word length/size
        if (trimmedWord.length < MIN_WORD_LENGTH || trimmedWord.length > MAX_WORD_LENGTH) {
            return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        // Valid characters
        const containsInvalidChar = [...trimmedWord].some(
            letter => !ALLOWED_WORD_CHARACTERS.includes(letter)
        );        
        if (containsInvalidChar) {
           return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        return WordFormatResponseFactory.VALID(trimmedWord);
    }

    /**
     * Checks if more than 50% of the letters in a word are vowels
     * @param word - The word to check
     * @returns true if more than 50% of letters are vowels, false otherwise
     */
    static hasTooManyVowels(word: string): boolean {
    if (!word || word.length === 0) {
        return false;
    }

    const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
    let vowelCount = 0;

    for (const letter of word) {
        if (vowels.has(letter)) {
        vowelCount++;
        }
    }

    const vowelPercentage = vowelCount / word.length;
    return vowelPercentage > 0.5;
    }    
}

class WordFormatResponseFactory {
    static VALID(word: string): ValidateWordFormatResponse {
        return {
            word: word,
            isValid: true
        }
    } 

    static INVALID(word: string): ValidateWordFormatResponse {
        return {
            word: word,
            isValid: false
        }
    }     
}