import { ILanguageWordChecker } from "./language-word-checker";

/**
 * Dutch language word checker implementation
 */
export class DutchWordChecker implements ILanguageWordChecker {
    looksLikeRealWord(word: string): boolean {
        if (!word || word.length < 2) {
            return false;
        }

        const normalizedWord = word.toLowerCase();
        let score = 0;

        // Check for common Dutch letter combinations (positive scoring)
        score += this.checkDutchCombinations(normalizedWord);
        
        // Check vowel patterns typical in Dutch
        score += this.checkVowelPatterns(normalizedWord);
        
        // Check for typical Dutch word structure
        score += this.checkWordStructure(normalizedWord);
        
        // Penalize for non-Dutch patterns
        score -= this.checkNonDutchPatterns(normalizedWord);

        // A score of 2 or higher suggests it looks Dutch-like
        return score >= 2;
    }

    /**
     * Checks for common Dutch letter combinations and digraphs
     */
    private checkDutchCombinations(word: string): number {
        let points = 0;
        
        // Common Dutch digraphs and combinations
        const dutchCombinations = [
            'ij', 'aa', 'ee', 'oo', 'uu', // Dutch vowel combinations
            'sch', 'ch', 'ng', 'nk',      // Common consonant combinations
            'ui', 'au', 'ou', 'ei', 'ie'  // More Dutch diphthongs
        ];

        dutchCombinations.forEach(combination => {
            if (word.includes(combination)) {
                points += 1;
            }
        });

        return Math.min(points, 3); // Cap at 3 points to avoid over-weighting
    }

    /**
     * Checks for typical Dutch vowel patterns
     */
    private checkVowelPatterns(word: string): number {
        let points = 0;
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        
        // Dutch typically has a good vowel-to-consonant ratio
        const vowelCount = word.split('').filter(char => vowels.includes(char)).length;
        const consonantCount = word.split('').filter(char => consonants.includes(char)).length;
        
        if (consonantCount > 0) {
            const vowelRatio = vowelCount / consonantCount;
            // Dutch words typically have vowel ratio between 0.3 and 1.2
            if (vowelRatio >= 0.3 && vowelRatio <= 1.2) {
                points += 2;
            }
        }

        return points;
    }

    /**
     * Checks for typical Dutch word structure patterns
     */
    private checkWordStructure(word: string): number {
        let points = 0;

        // Common Dutch endings
        const dutchEndings = ['en', 'er', 'el', 'je', 'jes', 'ing', 'lijk'];
        dutchEndings.forEach(ending => {
            if (word.endsWith(ending)) {
                points += 1;
            }
        });

        // Dutch words often start with common patterns
        const dutchStarts = ['ge', 'be', 'ver', 'ont', 'aan', 'uit'];
        dutchStarts.forEach(start => {
            if (word.startsWith(start) && word.length > start.length + 1) {
                points += 1;
            }
        });

        // Bonus for compound-looking words (common in Dutch)
        if (word.length > 6 && this.looksLikeCompound(word)) {
            points += 1;
        }

        return Math.min(points, 2); // Cap at 2 points
    }

    /**
     * Checks if word looks like a Dutch compound word
     */
    private looksLikeCompound(word: string): boolean {
        // Simple heuristic: look for vowel-consonant patterns that suggest word boundaries
        const pattern = /[aeiou][bcdfghjklmnpqrstvwxyz]{1,3}[aeiou]/g;
        const matches = word.match(pattern);
        return Boolean(matches && matches.length >= 2);    }

    /**
     * Penalizes patterns that are uncommon in Dutch
     */
    private checkNonDutchPatterns(word: string): number {
        let penalties = 0;

        // Patterns rare in Dutch
        const nonDutchPatterns = [
            /q(?!u)/,           // Q not followed by U
            /[xyz]/,            // X, Y, Z are rare in native Dutch words
            /[bcdfghjklmnpqrstvwxyz]{4,}/, // Too many consecutive consonants
            /[aeiou]{4,}/,      // Too many consecutive vowels
            /^[bcdfghjklmnpqrstvwxyz]{3,}/, // Too many consonants at start
        ];

        nonDutchPatterns.forEach(pattern => {
            if (pattern.test(word)) {
                penalties += 2;
            }
        });

        // Very short words with unusual patterns
        if (word.length <= 3 && !/[aeiou]/.test(word)) {
            penalties += 2;
        }

        return penalties;
    }
}
