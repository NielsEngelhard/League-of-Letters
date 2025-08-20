import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";


describe("validate wrong evaluated letters", () => {
    it("should validate totally incorrect guess correctly", () => {
        const actualWord = WordStateFactory.create("henk");
        const guess      = "sjos";

        const result = WordValidator.validate(guess, actualWord, []);

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "S", state: LetterState.Wrong }),
                expect.objectContaining({ letter: "J", state: LetterState.Wrong }),
                expect.objectContaining({ letter: "O", state: LetterState.Wrong }),
                expect.objectContaining({ letter: "S", state: LetterState.Wrong }),
            ])
        );        
    });
});
