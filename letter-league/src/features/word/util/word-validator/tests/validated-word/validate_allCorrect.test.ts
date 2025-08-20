import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("allCorrect in response", () => {
    it("should return allCorrect=TRUE when the word is guessed", () => {
        const actualWord = "banaan";
        const guess      = "banaan";

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord),
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.allCorrect).toBe(true);    
    });

    it("should return allCorrect=FALSE when the word is NOT guessed", () => {
        const actualWord = "banaan";
        const guess      = "banaen";

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord),
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.allCorrect).toBe(false);    
    });    
});
