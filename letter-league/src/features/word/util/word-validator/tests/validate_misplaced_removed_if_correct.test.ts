import { LetterState } from "../../../word-models";
import { WordStateFactory } from "../../factories/word-state-factory";
import { WordValidator } from "../word-validator";

describe("validate remove misplaced letters if they are not misplaced in combination with correct", () => {
    it("should mark the misplaced letters as wrong", () => {
        const actualWord = "banaan";
        const guess      = "aaaaaa";

        // b a MISPLACED - but wrong because all a's are already guessed during this guess
        // a a CORRECT
        // n a MISPLACED - but wrong because all a's are already guessed during this guess
        // a a CORRECT
        // a a CORRECT
        // n a MISPLACED - but wrong because all a's are already guessed during this guess

        const wordState = WordStateFactory.create(actualWord);

        const result = WordValidator.validateAndFilter(guess, wordState, []);

        expect(result.newLetters).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Wrong, position: 1 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 2 }),
                expect.objectContaining({ letter: "A", state: LetterState.Wrong, position: 3 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 4 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 5 }),
                expect.objectContaining({ letter: "A", state: LetterState.Wrong, position: 6 }),
            ])
        );        
    });
});
