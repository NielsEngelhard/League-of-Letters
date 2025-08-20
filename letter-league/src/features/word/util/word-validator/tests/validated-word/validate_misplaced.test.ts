import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("", () => {
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
})