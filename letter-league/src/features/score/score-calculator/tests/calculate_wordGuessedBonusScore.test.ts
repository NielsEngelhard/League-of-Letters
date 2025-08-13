import { INSTANT_GUESS_BONUS, SECOND_GUESS_BONUS, JUST_A_GUESS_BONUS } from "../../score-constants";
import { EvaluatedLetter, LetterState } from "../../../word/word-models";
import { ScoreCalculator } from "../score-calculator";

describe("calculate bonus points", () => {
    it("should assign bonus points when the guess is guessed in the first round", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 1,
            wordGuessed: true,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        expect(score.wordGuessedBonusScore).toEqual(INSTANT_GUESS_BONUS);
    });

    it("should assign bonus points when the guess is guessed in the second round", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 2,
            wordGuessed: true,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        expect(score.wordGuessedBonusScore).toEqual(SECOND_GUESS_BONUS);
    });
    
    it("should assign bonus points when the guess is guessed after the second round", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 3,
            wordGuessed: true,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });

        expect(score.wordGuessedBonusScore).toEqual(JUST_A_GUESS_BONUS);
    });  
    
    it("should assign standard guess points if guess is guessed after second round", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
        ];

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 4,
            wordGuessed: true,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [],
        });


        expect(score.wordGuessedBonusScore).toEqual(JUST_A_GUESS_BONUS);
    });      
});
