import { LetterState } from "../../../../word/word-models";
import { WordValidator } from "../word-validator";

describe("validate casing", () => {
    it("should ignore casing 1", () => {
        const actualWord = "A";
        const guess      = "a";

        const result = WordValidator.validateEntireWord(guess, actualWord);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 1 }),
            ])
        );        
    });

    it("should ignore casing 2", () => {
        const actualWord = "a";
        const guess      = "A";

        const result = WordValidator.validateEntireWord(guess, actualWord);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 1 }),
            ])
        );        
    });
});
