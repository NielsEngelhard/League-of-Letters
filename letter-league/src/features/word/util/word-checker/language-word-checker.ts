import { SupportedLanguage } from "@/features/i18n/languages";
import { DutchWordChecker } from "./dutch-word-checker";
import { EnglishWordChecker } from "./english-word-checker";

/**
 * Interface for language-specific word checking algorithms
 */
export interface ILanguageWordChecker {
    /**
     * Determines if a word looks like it could be a real word in this language
     * @param word - The word to analyze
     * @returns boolean - true if the word looks like it belongs to this language
     */
    looksLikeRealWord(word: string): boolean;
}

/**
 * Updated RealWordFinder that uses language-specific checkers
 */
export class RealWordFinder {
    /**
     * Determines if a word looks like it could be a real word in the specified language
     * @param word - The word to analyze
     * @param languageCode - ISO 639-1 language code (defaults to 'nl')
     * @returns boolean - true if the word looks like it belongs to the specified language
     */
    static looksLikeRealWord(word: string, languageCode: SupportedLanguage): boolean {
        const checker = LanguageWordCheckerFactory.getChecker(languageCode);
        return checker.looksLikeRealWord(word);
    }
}

/**
 * Factory for creating language-specific word checkers
 */
export class LanguageWordCheckerFactory {
    private static checkers: Map<string, ILanguageWordChecker> = new Map([
        ['nl', new DutchWordChecker()],
        ['en', new EnglishWordChecker()]
    ] as Array<[string, ILanguageWordChecker]>);

    /**
     * Gets a word checker for the specified language
     * @param languageCode - ISO 639-1 language code (e.g., 'nl', 'en')
     * @returns Language-specific word checker
     * @throws Error if language is not supported
     */
    static getChecker(languageCode: SupportedLanguage): ILanguageWordChecker {
        const checker = this.checkers.get(languageCode.toLowerCase());
        if (!checker) {
            throw new Error(`Language '${languageCode}' is not supported. Supported languages: ${Array.from(this.checkers.keys()).join(', ')}`);
        }
        return checker;
    }

    /**
     * Gets all supported language codes
     * @returns Array of supported language codes
     */
    static getSupportedLanguages(): string[] {
        return Array.from(this.checkers.keys());
    }

    /**
     * Registers a new language checker
     * @param languageCode - ISO 639-1 language code
     * @param checker - Word checker implementation
     */
    static registerChecker(languageCode: string, checker: ILanguageWordChecker): void {
        this.checkers.set(languageCode.toLowerCase(), checker);
    }
}