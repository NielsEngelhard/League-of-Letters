import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("validate should update the acutal word state", () => {
    it("should set all statuses to guessed for the acutalWordState", () => {
        const actualWordState = WordStateFactory.create("banaan");
        const guess      = "banaan";

        WordValidator.validate({
            actualWordState: actualWordState,
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(actualWordState.letterStates[0].guessed).toBeTruthy();
        expect(actualWordState.letterStates[1].guessed).toBeTruthy();
        expect(actualWordState.letterStates[2].guessed).toBeTruthy();
        expect(actualWordState.letterStates[3].guessed).toBeTruthy();
        expect(actualWordState.letterStates[4].guessed).toBeTruthy();
        expect(actualWordState.letterStates[5].guessed).toBeTruthy();       
    });
    
    it("should update the guessed statusses for the acutalWordState", () => {
        const actualWordState = WordStateFactory.create("banaan");
        const guess      = "beneen";

        WordValidator.validate({
            actualWordState: actualWordState,
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(actualWordState.letterStates[0].guessed).toBeTruthy();
        expect(actualWordState.letterStates[1].guessed).toBeFalsy();
        expect(actualWordState.letterStates[2].guessed).toBeTruthy();
        expect(actualWordState.letterStates[3].guessed).toBeFalsy();
        expect(actualWordState.letterStates[4].guessed).toBeFalsy();
        expect(actualWordState.letterStates[5].guessed).toBeTruthy();    
    });

    it("should not update any guessed status for the acutalWordState", () => {
        const actualWordState = WordStateFactory.create("banaan", false);
        const guess      = "koekje";

        WordValidator.validate({
            actualWordState: actualWordState,
            guess: guess,
            currentGuessIndex: 1,
            previouslyGuessedMisplacedLetters: []
        });

        expect(actualWordState.letterStates[0].guessed).toBeFalsy();
        expect(actualWordState.letterStates[1].guessed).toBeFalsy();
        expect(actualWordState.letterStates[2].guessed).toBeFalsy();
        expect(actualWordState.letterStates[3].guessed).toBeFalsy();
        expect(actualWordState.letterStates[4].guessed).toBeFalsy();
        expect(actualWordState.letterStates[5].guessed).toBeFalsy();    
    });
});
