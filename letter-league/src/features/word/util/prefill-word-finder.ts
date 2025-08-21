import { EvaluatedWord, LetterState } from "../word-models";

export function preFillWordFinder(words: EvaluatedWord[]): string {
    debugger;
  if (words.length === 0) return '';
  
  let maxConsecutiveCorrect = 0;
  let bestSequence = '';
  
  for (const word of words) {
    // Sort letters by position to ensure correct order
    const sortedLetters = word.evaluatedLetters.sort((a, b) => a.position - b.position);
    
    // Build consecutive correct sequence from the start
    let sequence = '';
    for (const letter of sortedLetters) {
      if (letter.state === LetterState.Correct) {
        sequence += letter.letter;
      } else {
        break; // Stop at first non-correct or out-of-sequence letter
      }
    }
    
    if (sequence.length > maxConsecutiveCorrect) {
      maxConsecutiveCorrect = sequence.length;
      bestSequence = sequence;
    }
  }
  
  return bestSequence;
}