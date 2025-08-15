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

export const LetterStateSortOrder = {
  [LetterState.Correct]: 0,
  [LetterState.Misplaced]: 1,
  [LetterState.Wrong]: 2,
  [LetterState.Unguessed]: 3
};

export interface EvaluatedWord {
    position: number;
    evaluatedLetters: EvaluatedLetter[];
}

export interface WordState {
    word: string;
    letterStates: WordLetterState[];
}

export interface WordLetterState {
    letter: string;
    guessed: boolean;
}