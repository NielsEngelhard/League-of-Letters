import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("validate casing", () => {
    it("should ignore casing 1", () => {
        const actualWord = "A";
        const guess      = "a";

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord),
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 1 }),
            ])
        );        
    });

    it("should ignore casing 2", () => {
        const actualWord = "a";
        const guess      = "A";

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord),
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 1 }),
            ])
        );        
    });
});
