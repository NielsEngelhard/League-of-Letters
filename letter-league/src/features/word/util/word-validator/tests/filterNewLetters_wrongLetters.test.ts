import { LetterState, EvaluatedLetter } from "../../../../word/word-models";
import { WordValidator } from "../word-validator";


describe("filterNewLetters correct letters", () => {
    it("should filter wrong letters that were not already guessed", () => {
        const validatedGuess: EvaluatedLetter[] = [
            { letter: "L", position: 1, state: LetterState.Correct },
            { letter: "O", position: 2, state: LetterState.Wrong },
            { letter: "F", position: 3, state: LetterState.Wrong },
            { letter: "T", position: 4, state: LetterState.Misplaced }
        ];

        const previouslyGuessedLetters: EvaluatedLetter[] = [
            { letter: "W", state: LetterState.Wrong, position: 0 },
            { letter: "L", state: LetterState.Wrong, position: 0 },
            { letter: "Z", state: LetterState.Misplaced, position: 0 }
        ];

        const result = WordValidator.filterNewLetters(validatedGuess, previouslyGuessedLetters);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "O", state: LetterState.Wrong }),
                expect.objectContaining({ letter: "F", state: LetterState.Wrong }),
            ])
        );        
    });

    it("should not filter wrong letters that were already guessed", () => {
        const validatedGuess: EvaluatedLetter[] = [
            { letter: "L", position: 1, state: LetterState.Correct },
            { letter: "O", position: 2, state: LetterState.Wrong },
            { letter: "F", position: 3, state: LetterState.Wrong },
            { letter: "T", position: 4, state: LetterState.Misplaced }
        ];

        const previouslyGuessedLetters: EvaluatedLetter[] = [
            { letter: "F", state: LetterState.Wrong, position: 0 },
        ];

        const result = WordValidator.filterNewLetters(validatedGuess, previouslyGuessedLetters);

        expect(result).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "O", state: LetterState.Wrong }),
            ])
        );   
        
        expect(result).not.toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "F", state: LetterState.Wrong }),
            ])
        );           
    });

    it("should not add duplicates of wrong letter in the same guess", () => {
        const validatedGuess: EvaluatedLetter[] = [
            { letter: "C", position: 1, state: LetterState.Correct },
            { letter: "O", position: 2, state: LetterState.Correct },
            { letter: "F", position: 3, state: LetterState.Correct },
            { letter: "F", position: 4, state: LetterState.Correct },
            { letter: "A", position: 5, state: LetterState.Wrong },
            { letter: "A", position: 6, state: LetterState.Wrong },
        ];

        const previouslyGuessedLetters: EvaluatedLetter[] = [{ letter: "C", position: 1, state: LetterState.Correct }];

        const result = WordValidator.filterNewLetters(validatedGuess, previouslyGuessedLetters);

        const wrongLettersA = result.filter(l => l.letter == "A");

        expect(wrongLettersA).toHaveLength(1);        
    });    
});
