import { SupportedLanguage } from "../i18n/languages";

export interface EvaluatedWord {
    position: number;
    evaluatedLetters: EvaluatedLetter[];
}

export type EvaluatedLetter = {
    position: number;
    letter: string;    
    state: LetterState;    
}

export enum LetterState {
  Correct = "correct",
  CompleteCorrect = "complete-correct", // Only used in client to indicate that it is sure that there are no more misplaced letters of this letter
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

export interface LanguageWordCount {
    language: SupportedLanguage;
    wordCount: number;
}