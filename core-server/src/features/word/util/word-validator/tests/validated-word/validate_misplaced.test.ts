import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("validate misplaced letters", () => {
    it("should validate wrong positions correctly", () => {
        const firstLetterIsGuessed: boolean  = false; // Set the first letter to unguessed for the test (so all will be misplaced)
        const actualWord = "konijn";
        const guess      = "njinok";

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord, firstLetterIsGuessed), 
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "K", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "O", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "N", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "I", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "J", state: LetterState.Misplaced }),
                expect.objectContaining({ letter: "N", state: LetterState.Misplaced }),                
            ])
        );        
    });   
    
    it("should update the new misplaced letters list from the input with new misplaced letters", () => {
        const actualWord = "abba";
        const guess      = "baas"; // a is misplaced (twice) but it should only be added once

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord), 
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.evaluatedGuess).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ letter: "A", state: LetterState.Misplaced }),
            ])
        );        
    });   

    it("should return an updated version of the input 'previouslyGuessedMisplacedLetters'", () => {
        const actualWord = "abba";
        const guess      = "kaas"; // a is misplaced (twice) but it should only be added once

        const result = WordValidator.validate({
            actualWordState: WordStateFactory.create(actualWord), 
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(result.previouslyGuessedMisplacedLetters.length).toEqual(1);
        expect(result.previouslyGuessedMisplacedLetters[0]).toEqual('A');
    });   

    it('should NOT add the letter as previous letter if the letter is guessed once but occurs twice EDGE CASE', () => {
        const wordState = WordStateFactory.create("aaa", false);
        
        const result = WordValidator.validate({
            actualWordState: wordState,
            guess: "abb", // A is correct, but also occurs one more time, should not indicate as previous guess
            previouslyGuessedMisplacedLetters: [],
            currentGuessIndex: 1
        });

        expect(result.previouslyGuessedMisplacedLetters.length).toBe(0);    
    });           
})