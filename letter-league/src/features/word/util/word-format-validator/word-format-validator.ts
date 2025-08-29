import { ALLOWED_NORMAL_CHARACTERS, MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "../../../../features/game/game-constants";

export interface ValidateWordFormatResponse {
    word: string;
    isValid: boolean;
}

export class WordFormatValidator {
    static validateFormat(word: string, allowedCharacters: string[] = ALLOWED_NORMAL_CHARACTERS): ValidateWordFormatResponse {
       
       
        const trimmedWord = word.trim().toUpperCase();

        // Valid word length/size
        if (trimmedWord.length < MIN_WORD_LENGTH || trimmedWord.length > MAX_WORD_LENGTH) {
            return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        // Valid characters
        const containsInvalidChar = [...trimmedWord].some(
            letter => !allowedCharacters.includes(letter)
        );        
        if (containsInvalidChar) {
           return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        // Is not a roman number
        if (this.isRomanNumeral(trimmedWord)) {
            return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        // If all characters are the same
        if (this.allSameChars(trimmedWord)) {
            return WordFormatResponseFactory.INVALID(trimmedWord)
        }

        return WordFormatResponseFactory.VALID(trimmedWord);
    }

    static isRomanNumeral(str: string): boolean {
        // Regex for valid Roman numerals (up to 3999)
        const romanRegex = /^(M{0,3})(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
        return romanRegex.test(str);
    }    

    static replaceSpecialCharacters(input: string): string {
        return input
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove combining marks
            .replace(/ø/g, "o")              // handle special cases
            .replace(/Ø/g, "O")
            .replace(/æ/g, "ae")
            .replace(/Æ/g, "Ae")
            .replace(/ß/g, "ss");
    } 

    static allSameChars(str: string): boolean {
        if (str.length === 0) return false; // or true, depending on your needs

        return str.split('').every(char => char === str[0]);
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