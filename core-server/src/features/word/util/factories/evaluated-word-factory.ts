import { EvaluatedLetter, EvaluatedWord, LetterState } from "../../word-models";

export class EvaluatedWordFactory {
    static createSkipped(length: number, position: number): EvaluatedWord {
        const evaluatedLetters: EvaluatedLetter[] = Array.from({ length }, (_, index) => ({
           letter: "",
           position: index + 1,
           state: LetterState.Skipped          
        }));        

        return {
            position: position,
            evaluatedLetters: evaluatedLetters
        }
    }
}