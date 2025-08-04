import { EvaluatedLetter } from "../word/word-models";

export interface CalculateScoreCommand {
    newLetters: EvaluatedLetter[];
    previouslyGuessedLetters: EvaluatedLetter[];
    currentGuessIndex: number;
    wordGuessed: boolean;
}

export interface CalculateScoreResult {
    totalScore: number; // Combination of all items you can score on

    letterStateScore: number;
    wordGuessedBonusScore: number;
    streakScore: number;
}