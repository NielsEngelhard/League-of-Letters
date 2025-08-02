export type EvaluatedLetter = {
    position: number;
    letter: string;    
    state: LetterState;    
}

export enum LetterState {
  Correct = "correct",
  Wrong = "wrong",
  Misplaced = "misplaced",
  Unguessed = "unguessed",
}

export interface WordState {
    word: string;
    letterStates: WordLetterState[];
}

export interface WordLetterState {
    letter: string;
    guessed: boolean;
}