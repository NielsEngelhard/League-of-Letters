import { LetterState } from "../../../../../../features/word/word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("specific long scenarios - based on real testing", () => {
    it("should not mark already guessed non occuring letters as misplaced REAL SCENARIO 1", () => {
        const actualWordState = WordStateFactory.create("basalt");
        
        // Based on real test scenario
        const firstGuess = "baaard";
        const secondGuess = "bassat";
        const thirdGuess = "basant";
        const fourthGuess = "anusje";

        const result1 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: firstGuess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        const result2 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: secondGuess,
            currentGuessIndex: 2,
            previouslyGuessedMisplacedLetters: result1.previouslyGuessedMisplacedLetters
        });
        
        const result3 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: thirdGuess,
            currentGuessIndex: 3,
            previouslyGuessedMisplacedLetters: result2.previouslyGuessedMisplacedLetters
        });
        
        const result4 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: fourthGuess,
            currentGuessIndex: 4,
            previouslyGuessedMisplacedLetters: result3.previouslyGuessedMisplacedLetters
        });        

        expect(result4.evaluatedGuess[3].letter).toBe("S");
        expect(result4.evaluatedGuess[3].state).toBe(LetterState.Wrong);
        expect(result4.evaluatedGuess[3].position).toBe(4);
    });

    it("should not mark already guessed non occuring letters as misplaced REAL SCENARIO 2", () => {
        const actualWordState = WordStateFactory.create("hoefde");
        
        // Based on real test scenario
        const firstGuess = "heefde";
        const secondGuess = "heoloo";

        const result1 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: firstGuess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        const result2 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: secondGuess,
            currentGuessIndex: 2,
            previouslyGuessedMisplacedLetters: result1.previouslyGuessedMisplacedLetters
        });

        expect(result2.evaluatedGuess[1].letter).toBe("E");
        expect(result2.evaluatedGuess[1].state).toBe(LetterState.Wrong);
        expect(result2.evaluatedGuess[1].position).toBe(2);
    });
    
    it("should mark misplaced letter still as misplaced if not guessed in second try either SCENARIO 1", () => {
        const actualWordState = WordStateFactory.create("inslag");
        
        // Based on real test scenario
        const firstGuess = "inslga"; // G & A = Misplaced
        const secondGuess = "gaaaaa"; // Only G = Misplaced

        const result1 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: firstGuess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        const result2 = WordValidator.validate({
            actualWordState: actualWordState, 
            guess: secondGuess,
            currentGuessIndex: 2,
            previouslyGuessedMisplacedLetters: result1.previouslyGuessedMisplacedLetters
        });

        expect(result2.evaluatedGuess[0].letter).toBe("G");
        expect(result2.evaluatedGuess[0].state).toBe(LetterState.Misplaced);
        expect(result2.evaluatedGuess[0].position).toBe(1);
    });          
});