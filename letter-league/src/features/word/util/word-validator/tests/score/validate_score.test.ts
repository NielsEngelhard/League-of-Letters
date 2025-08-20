import { LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE_POINTS, WORD_GUESSED_FIRST_TRY_BONUS_POINTS, WORD_GUESSED_POINTS } from "../../../../../../features/score/score-constants";
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
});