import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("", () => {
    it("should validate wrong positions correctly", () => {
        const actualWord = WordStateFactory.create("konijn", false);
        const guess      = "njinok";

        const result = WordValidator.validate(guess, actualWord, []);

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "K", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "O", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "N", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "I", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "J", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "N", state: LetterState.Misplaced }),                
            ])
        );        
    });    
})