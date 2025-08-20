import { LETTER_CORRECT_AFTER_MISPLACED_POINTS, LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS, LETTER_MISPLACED_POINTS, WORD_GUESSED_FIRST_TRY_BONUS_POINTS, WORD_GUESSED_POINTS } from "../../../../../../features/score/score-constants";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe('WordValidator should assign the correct score for correct and misplaced letters', () => {
    it('should assign correct score when correctly guessed in first guess', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("kaas"),
            guess: "kaas",
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });

        const expectedScore = 
            (LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS * 3) + // points for each correct letter (first letter is already known as hint so does not count for correctly guessed)
            WORD_GUESSED_POINTS +               // base points for correct guess
            WORD_GUESSED_FIRST_TRY_BONUS_POINTS // bonus points for correct on 1st try
    
        expect(result.score).toBe(expectedScore);    
    });

    it('should assign no score when all letters are wrong', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("kaas", false),
            guess: "leun",
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });
    
        expect(result.score).toBe(0);    
    });   

    it('should assign no score when all letters are wrong, except the first already known hint (thus no points)', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("kaas"),
            guess: "keep", // first is correct but already guessed (hint) so no points assigned
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });
    
        expect(result.score).toBe(0);    
    });

    it('should assign misplaced score for misplaced letter once, when the misplaced letter occurs twice', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("kaas", false),
            guess: "abba", // a is misplaced twice, but should assign points once
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });

        const expectedScore = LETTER_MISPLACED_POINTS * 1;
    
        expect(result.score).toBe(expectedScore);    
    });    

    it('should assign misplaced and correct score combined when the guess is partially correct with some misplaced', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("popen", false),
            guess: "lopen",
            previouslyGuessedMisplacedLetters: ['N'],
            currentGuessIndex: 1
        });

        const expectedScore = (LETTER_MISPLACED_POINTS * 0) + // Misplaced; P is misplaced and correct but the misplaced is not visible (only correct position guessed)
                              (LETTER_CORRECT_AFTER_MISPLACED_POINTS * 1) + // correct AFTER misplaced
                              (LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS * 3); // correct without misplaced
        expect(result.score).toBe(expectedScore);    
    });        

    it('should assign misplaced after correct points correctly', () => {
        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create("maken", false),
            guess: "moken", // k and m = correct but previously misplaced so not full points should be assigned
            previouslyGuessedMisplacedLetters: ['K', 'M'],
            currentGuessIndex: 1
        });

        const expectedScore = (LETTER_CORRECT_AFTER_MISPLACED_POINTS * 2) + // correct AFTER misplaced
                              (LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS * 2); // correct without misplaced
        expect(result.score).toBe(expectedScore);    
    });

    it('should assign the score only for CORRECT if the letter is guessed once but occurs twice EDGE CASE', () => {
        const wordState = WordStateFactory.create("aaa", false);
        
        const result = WordValidator.validate({
            actualWordState: wordState,
            guess: "abb", // A is correct, but also occurs one more time, should not assign twice
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });

        const expectedScore = (LETTER_MISPLACED_POINTS * 0) + // Misplaced; P is misplaced and correct but the misplaced is not visible (only correct position guessed)
                              (LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS * 1); // correct without misplaced
        expect(result.score).toBe(expectedScore);    
    });       
});