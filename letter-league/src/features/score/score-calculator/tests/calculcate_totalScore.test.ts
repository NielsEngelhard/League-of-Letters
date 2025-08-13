
import { CALCULATE_STREAK_POINTS, INSTANT_CORRECT_POINTS, INSTANT_GUESS_BONUS, MISPLACED_POINTS, CORRECT_AFTER_MISPLACED_POINTS } from "../../score-constants";
import { EvaluatedLetter, LetterState } from "../../../word/word-models";
import { ScoreCalculator } from "../score-calculator";

describe("calculate total score", () => {
    it("should have correct total score scenario 'INSTANT CORRECT'", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "A", position: 1, state: LetterState.Correct },
            { letter: "B", position: 2, state: LetterState.Correct },
            { letter: "C", position: 3, state: LetterState.Correct },
            { letter: "D", position: 4, state: LetterState.Correct },
        ];

        const expectedScore = 
            newCorrectLetters.length * INSTANT_CORRECT_POINTS    // FOR NEW CORRECT LETTER STATES
            + INSTANT_GUESS_BONUS                                // FOR FIRST TRY GUESSING THE WORD 
            + CALCULATE_STREAK_POINTS(newCorrectLetters.length); // FOR STREAK OF

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 1,
            wordGuessed: true,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [{ letter: "A", position: 1, state: LetterState.Correct }],
        });

        expect(score.totalScore).toEqual(expectedScore);
    });

    it("should have correct total score scenario 'JUST A NORMAL GUESS WITH SOME CORRECT SOME MISPLACED AND SOME WRONG'", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "B", position: 2, state: LetterState.Correct },
            { letter: "C", position: 5, state: LetterState.Misplaced },
            { letter: "D", position: 4, state: LetterState.Misplaced },
            { letter: "Q", position: 7, state: LetterState.Wrong },
        ];

        const expectedScore = 
            1 * INSTANT_CORRECT_POINTS // CORRECT LETTERSTATE
            + 2 * MISPLACED_POINTS;    // MISPLACED LETTERSTATE

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 2,
            wordGuessed: false,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [{ letter: "A", position: 1, state: LetterState.Correct }],
        });

        expect(score.totalScore).toEqual(expectedScore);
    });    

      it("should have correct total score scenario 'JUST A NORMAL GUESS WITH SOME CORRECT SOME MISPLACED AND SOME WRONG AND A STREAK OF 4 AND ONE CORRECT AFTER MISPLACED'", () => {
        const newCorrectLetters: EvaluatedLetter[] = [
            { letter: "B", position: 1, state: LetterState.Correct },
            { letter: "Z", position: 12, state: LetterState.Misplaced },
            { letter: "C", position: 3, state: LetterState.Correct },
            { letter: "Z", position: 9, state: LetterState.Misplaced },
            { letter: "J", position: 55, state: LetterState.Wrong },
            { letter: "O", position: 9, state: LetterState.Wrong },
            { letter: "D", position: 2, state: LetterState.Correct },
            { letter: "Q", position: 4, state: LetterState.Correct },
        ];

        const expectedScore = 
            2 * INSTANT_CORRECT_POINTS           // INSTANT CORRECT LETTERSTATE
            + 2 * MISPLACED_POINTS               // MISPLACED LETTERSTATE
            + 2 * CORRECT_AFTER_MISPLACED_POINTS // CORRECT AFTER MISPLACED LETTERSTATE
            + CALCULATE_STREAK_POINTS(4);        // STREAK BONUS

        const score = ScoreCalculator.calculate({
            currentGuessIndex: 2,
            wordGuessed: false,
            newLetters: newCorrectLetters,
            previouslyGuessedLetters: [{ letter: "B", state: LetterState.Misplaced, position: 1 }, { letter: "Q", state: LetterState.Misplaced, position: 0 }],
        });

        expect(score.totalScore).toEqual(expectedScore);
    }); 
});
