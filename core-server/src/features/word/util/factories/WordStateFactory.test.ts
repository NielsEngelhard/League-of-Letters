import { WordState } from "../../word-models";
import { WordStateFactory } from "./word-state-factory";

describe("Validate normal letters are not changed", () => {
    it("Should add the original word and the filtered word correctly", () => {
        const originalInput = "wagen";
        const expectedWordState: WordState = {
            originalWord: originalInput.toUpperCase(),
            strippedWord: originalInput.toUpperCase(), // The same because there are no special characters
            letterStates: [
                { letter: "W", guessed: true },
                { letter: "A", guessed: false },
                { letter: "G", guessed: false },
                { letter: "E", guessed: false },
                { letter: "N", guessed: false }
            ]
        }
        const result = WordStateFactory.create(originalInput, true);

        expect(result).toEqual(expectedWordState);
    })

    it("Should add the stripped word with special characters and the original word correctly", () => {
        const originalInput = "wägËn";
        const strippedWord = "WAGEN";

        const expectedWordState: WordState = {
            originalWord: originalInput.toUpperCase(),
            strippedWord: strippedWord,
            letterStates: [
                { letter: "W", guessed: true },
                { letter: "A", guessed: false },
                { letter: "G", guessed: false },
                { letter: "E", guessed: false },
                { letter: "N", guessed: false }
            ]
        }
        const result = WordStateFactory.create(originalInput, true);

        expect(result).toEqual(expectedWordState);
    })    
});