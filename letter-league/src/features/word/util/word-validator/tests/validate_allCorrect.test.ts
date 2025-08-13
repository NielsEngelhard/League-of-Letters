import { WordValidator } from "../word-validator";

describe("allCorrect in response", () => {
    it("should return allCorrect=TRUE when the word is guessed", () => {
        const actualWord = "banaan";
        const guess      = "banaan";

        const result = WordValidator.validateAndFilter(guess, actualWord, []);

        expect(result.allCorrect).toBe(true);    
    });

    it("should return allCorrect=FALSE when the word is NOT guessed", () => {
        const actualWord = "banaan";
        const guess      = "banaen";

        const result = WordValidator.validateAndFilter(guess, actualWord, []);

        expect(result.allCorrect).toBe(false);    
    });    
});
