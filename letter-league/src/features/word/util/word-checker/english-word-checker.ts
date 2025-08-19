import { ILanguageWordChecker } from "./language-word-checker";

/**
 * English language word checker implementation
 */
export class EnglishWordChecker implements ILanguageWordChecker {
    looksLikeRealWord(word: string): boolean {
        if (!word || word.length < 2) {
            return false;
        }

        const normalizedWord = word.toLowerCase();
        let score = 0;

        // Check for common English letter combinations
        score += this.checkEnglishCombinations(normalizedWord);
        
        // Check vowel patterns typical in English
        score += this.checkVowelPatterns(normalizedWord);
        
        // Check for typical English word structure
        score += this.checkWordStructure(normalizedWord);
        
        // Penalize for non-English patterns
        score -= this.checkNonEnglishPatterns(normalizedWord);

        // A score of 2 or higher suggests it looks English-like
        return score >= 2;
    }

    /**
     * Checks for common English letter combinations and patterns
     */
    private checkEnglishCombinations(word: string): number {
        let points = 0;
        
        // Common English combinations
        const englishCombinations = [
            'th', 'ch', 'sh', 'wh', 'ph',    // Common consonant digraphs
            'tion', 'sion', 'ing', 'ed',     // Common endings
            'qu', 'ck', 'dge', 'tch',        // English-specific patterns
            'ough', 'augh', 'eigh'           // Complex English patterns
        ];

        englishCombinations.forEach(combination => {
            if (word.includes(combination)) {
                points += 1;
            }
        });

        return Math.min(points, 3); // Cap at 3 points
    }

    /**
     * Checks for typical English vowel patterns
     */
    private checkVowelPatterns(word: string): number {
        let points = 0;
        const vowels = 'aeiouy'; // Y can be a vowel in English
        const consonants = 'bcdfghjklmnpqrstvwxz';
        
        // English typically has a different vowel-to-consonant ratio than Dutch
        const vowelCount = word.split('').filter(char => vowels.includes(char)).length;
        const consonantCount = word.split('').filter(char => consonants.includes(char)).length;
        
        if (consonantCount > 0) {
            const vowelRatio = vowelCount / consonantCount;
            // English words typically have vowel ratio between 0.25 and 1.0
            if (vowelRatio >= 0.25 && vowelRatio <= 1.0) {
                points += 2;
            }
        }

        // Bonus for silent 'e' pattern (common in English)
        if (word.endsWith('e') && word.length > 3) {
            const beforeE = word[word.length - 2];
            if ('bcdfghjklmnpqrstvwxz'.includes(beforeE)) {
                points += 1;
            }
        }

        return points;
    }

    /**
     * Checks for typical English word structure patterns
     */
    private checkWordStructure(word: string): number {
        let points = 0;

        // Common English suffixes
        const englishSuffixes = [
            'ing', 'ed', 'er', 'est', 'ly', 'tion', 'sion', 
            'ness', 'ment', 'able', 'ible', 'ful', 'less'
        ];
        englishSuffixes.forEach(suffix => {
            if (word.endsWith(suffix)) {
                points += 1;
            }
        });

        // Common English prefixes
        const englishPrefixes = [
            'un', 're', 'pre', 'dis', 'over', 'under', 'out',
            'in', 'im', 'anti', 'auto', 'co', 'de', 'fore'
        ];
        englishPrefixes.forEach(prefix => {
            if (word.startsWith(prefix) && word.length > prefix.length + 1) {
                points += 1;
            }
        });

        return Math.min(points, 2); // Cap at 2 points
    }

    /**
     * Penalizes patterns that are uncommon in English
     */
    private checkNonEnglishPatterns(word: string): number {
        let penalties = 0;

        // Patterns rare in English
        const nonEnglishPatterns = [
            /q(?!u)/,           // Q not followed by U (very rare in English)
            /[bcdfghjklmnpqrstvwxz]{5,}/, // Too many consecutive consonants
            /[aeiou]{4,}/,      // Too many consecutive vowels
            /ij/,               // Dutch pattern, rare in English
            /aa|ee|oo/,         // Double vowels less common in English than Dutch
        ];

        nonEnglishPatterns.forEach(pattern => {
            if (pattern.test(word)) {
                penalties += 1;
            }
        });

        // Penalize words that look too much like other languages
        if (word.includes('sch') && word.length < 6) {
            penalties += 1; // German/Dutch pattern
        }

        return penalties;
    }
}
