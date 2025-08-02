import { EvaluatedLetter } from "../word/word-models";

export type UserGuess = {
  index: number;    
  letters: EvaluatedLetter[];
}