import { LetterState, EvaluatedLetter } from "../../../../word/word-models";
import { WordValidator } from "../word-validator";

describe("filterNewLetters correct letters", () => {
    it("should filter correct letters that were not already guessed", () => {
        const validatedGuess: EvaluatedLetter[] = [
            { letter: "J", position: 1, state: LetterState.Correct },
            { letter: "O", position: 2, state: LetterState.Wrong },
            { letter: "O", position: 3, state: LetterState.Wrong },
            { letter: "P", position: 4, state: LetterState.Correct }
        ];

        const previouslyGuessedLetters: EvaluatedLetter[] = [
            { letter: "W", state: LetterState.Wrong, position: 0 }
        ];

        const result = WordValidator.filterNewLetters(validatedGuess, previouslyGuessedLetters);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "J", state: LetterState.Correct, position: 1 }),
                expect.objectContaining({ letter: "P", state: LetterState.Correct, position: 4 }),
            ])
        );        
    });

    it("should not filter correct letters that were already guessed", () => {
        const validatedGuess: EvaluatedLetter[] = [
            { letter: "K", position: 1, state: LetterState.Correct },
            { letter: "L", position: 2, state: LetterState.Wrong },
            { letter: "O", position: 3, state: LetterState.Wrong },
            { letter: "S", position: 4, state: LetterState.Correct }
        ];

        const previouslyGuessedLetters: EvaluatedLetter[] = [
            { letter: "K", state: LetterState.Correct, position: 0 }
        ];

        const result = WordValidator.filterNewLetters(validatedGuess, previouslyGuessedLetters);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "S", state: LetterState.Correct, position: 4 }),
            ])
        );   
        
        expect(result).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "K", state: LetterState.Correct, position: 4 }),
            ])
        );           
    });
});
