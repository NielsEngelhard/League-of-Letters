import { ValidatedLetter } from "../word/word-models";

export type UserGuess = {
  index: number;    
  letters: ValidatedLetter[];
}