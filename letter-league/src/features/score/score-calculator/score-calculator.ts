import { EvaluatedLetter, LetterState } from "../../../features/word/word-models";
import { CALCULATE_STREAK_POINTS, CORRECT_AFTER_MISPLACED_POINTS, LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE, INSTANT_GUESS_BONUS, JUST_A_GUESS_BONUS, MISPLACED_POINTS, SECOND_GUESS_BONUS, STREAK_THRESHOLD } from "../score-constants";
import { CalculateScoreCommand, CalculateScoreResult } from "../score-models";
import { StreakFinder } from "../streak-finder";

export class ScoreCalculator {
    static calculate(command: CalculateScoreCommand): CalculateScoreResult {
        var result = getEmptyScore();
        
        for(var i=0; i<command.newLetters.length; i++) {
            const letter = command.newLetters[i];

            assignLetterStateScore(letter, command, result);
        }

        assignWordGuessedBonusScore(command, result);
        assignStreakBonusScore(command, result);

        return result;
    }
}

function assignStreakBonusScore(command: CalculateScoreCommand, result: CalculateScoreResult) {
    const newCorrectLetterPositions: number[] = command.newLetters
                                                       .filter(l => l.state == LetterState.Correct && l.position != undefined)
                                                       .map(l => l.position as number);
    
    const streaks = StreakFinder.findStreaks(newCorrectLetterPositions, STREAK_THRESHOLD);

    for (var i=0; i<streaks.length; i++) {
        const score = CALCULATE_STREAK_POINTS(streaks[i].length);
        result.totalScore += score;
        result.streakScore += score;
    }
}

function assignLetterStateScore(letter: EvaluatedLetter, command: CalculateScoreCommand, result: CalculateScoreResult) {
    if (letter.state == LetterState.Correct) {
        if (includesMisplacedLetter(letter.letter ?? "", command.previouslyGuessedLetters)) {
            result.letterStateScore += CORRECT_AFTER_MISPLACED_POINTS;
            result.totalScore += CORRECT_AFTER_MISPLACED_POINTS;
        } else {
            result.letterStateScore += LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE;
            result.totalScore += LETTER_CORRECTLY_GUESSED_WITHOUT_MISPLACE;
        }
    } else if (letter.state == LetterState.Misplaced) {
        result.letterStateScore += MISPLACED_POINTS;
        result.totalScore += MISPLACED_POINTS;
    }
}

function assignWordGuessedBonusScore(command: CalculateScoreCommand, result: CalculateScoreResult) {
    if (command.wordGuessed == true) {
        const bonusScore = calculateWordGuessedBonus(command.currentGuessIndex);
        
        result.wordGuessedBonusScore += bonusScore;
        result.totalScore += bonusScore;
    }     
}

function calculateWordGuessedBonus(currentGuessIndex: number): number {
    switch (currentGuessIndex) {
        case 1: 
            return INSTANT_GUESS_BONUS;
        case 2: 
            return SECOND_GUESS_BONUS;
        default: 
            return JUST_A_GUESS_BONUS;
    }
}

function getEmptyScore(): CalculateScoreResult {
    return {
        totalScore: 0,
        wordGuessedBonusScore: 0,
        letterStateScore: 0,
        streakScore: 0,
    };    
}

function includesMisplacedLetter(letter: string, letters: EvaluatedLetter[]): boolean {
    return letters.some(l => l.letter?.toUpperCase() == letter.toUpperCase() && l.state == LetterState.Misplaced);
}