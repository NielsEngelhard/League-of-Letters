import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";


describe("validate correct evaluated letters", () => {
    it("should validate full correct guess correctly", () => {
        const actualWord = WordStateFactory.create("banaan");
        const guess      = "banaan";

        const result = WordValidator.validate(guess, actualWord, []);

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "B", state: LetterState.Correct, position: 1 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 2 }),
                expect.objectContaining({ letter: "N", state: LetterState.Correct, position: 3 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 4 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 5 }),
                expect.objectContaining({ letter: "N", state: LetterState.Correct, position: 6 }),
            ])
        );        
    });
});
