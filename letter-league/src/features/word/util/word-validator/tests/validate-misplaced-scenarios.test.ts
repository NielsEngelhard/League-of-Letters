import { EvaluatedLetter, LetterState } from "../../../word-models";
import { WordStateFactory } from "../../factories/word-state-factory";
import { WordValidator } from "../word-validator";

describe("validate specific misplaced scenarios", () => {
    it("should mark the misplaced letters as wrong if not occur anymore", () => {
        const actualWord = "banaan";
        const guess      = "aaaaaa";

        // b a MISPLACED - but wrong because all a's are already guessed during this guess
        // a a CORRECT
        // n a MISPLACED - but wrong because all a's are already guessed during this guess
        // a a CORRECT
        // a a CORRECT
        // n a MISPLACED - but wrong because all a's are already guessed during this guess

        const wordState = WordStateFactory.create(actualWord);

        const result = WordValidator.validateAndFilter(guess, wordState, []);

        expect(result.newLetters).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Wrong, position: -1 }), // Wrong letters are only returned once per letter
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 2 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 4 }),
                expect.objectContaining({ letter: "A", state: LetterState.Correct, position: 5 }),
            ])
        );        
    });    

    it("should not return letter as misplaced when it was not misplaced before and not occur anymore", () => {
        const actualWord = "robots";
        
        const firstGuess = "rooots";
        const secondGuess = "oooooo"; // all O's are already guessed so should not return any new letters for the second guess
        
        const wordState = WordStateFactory.create(actualWord);
        const firstGuessResult = WordValidator.validateAndFilter(firstGuess, wordState, []);
        const previouslyGuessedLetters = firstGuessResult.newLetters;

        const secondGuessResult = WordValidator.validateAndFilter(secondGuess, wordState, previouslyGuessedLetters);

        expect(secondGuessResult.newLetters).toHaveLength(0);
    });

    // it("was misplaced, now correct, then guessed and not occur anymore, so should be present in wrong now too, with letter 'n'", () => {
    //     const actualWord = "afname";
        
    //     const firstGuess = "afmaan";
    //     const secondGuess = "afnaan"; // The last 'n' should also be added as Wrong because it does not occur anymore
        
    //     const wordState = WordStateFactory.create(actualWord);
    //     const firstGuessResult = WordValidator.validateAndFilter(firstGuess, wordState, []);
    //     const previouslyGuessedLetters = firstGuessResult.newLetters;

    //     const secondGuessResult = WordValidator.validateAndFilter(secondGuess, wordState, previouslyGuessedLetters);

    //     expect(secondGuessResult.newLetters).toContainEqual(
    //         expect.objectContaining({
    //             letter: "N",
    //             state: LetterState.Wrong
    //         })
    //     );
    // });

    it("was misplaced, then guessed and not occur anymore, so should be present in wrong now too, with letter 'e'", () => {
        const actualWord = "koekje";
        
        const firstGuess = "koetje";
        const secondGuess = "koeeee"; // The last 'n' should also be added as Wrong because it does not occur anymore
        
        const wordState = WordStateFactory.create(actualWord);
        const firstGuessResult = WordValidator.validateAndFilter(firstGuess, wordState, []);
        const previouslyGuessedLetters = firstGuessResult.newLetters;

        const secondGuessResult = WordValidator.validateAndFilter(secondGuess, wordState, previouslyGuessedLetters);

        expect(secondGuessResult.newLetters).toContainEqual(
            expect.objectContaining({
                letter: "E",
                state: LetterState.Wrong
            })
        );
    });        
});
