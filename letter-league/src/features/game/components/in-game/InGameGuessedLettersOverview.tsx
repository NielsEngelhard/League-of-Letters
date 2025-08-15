import Card from '@/components/ui/card/Card';
import React from 'react';
import { useActiveGame } from '../active-game-context';
import { LetterState, LetterStateSortOrder } from '@/features/word/word-models';

interface Props {

}

export default function InGameGuessedLettersOverview({}: Props) {
  const { currentRound } = useActiveGame();

  const getLetterStyle = (letterState: LetterState) => {
    if (letterState == LetterState.Correct) {
      return "bg-success text-white border-success";
    }
    if (letterState == LetterState.Misplaced) {
      return "bg-warning text-white border-warning";
    }
    if (letterState == LetterState.Wrong) {
      return "bg-error text-white border-error";
    }
    return "bg-gray-100 text-gray-700 border-gray-300";
  };

  return (
    <Card className="w-md py-3 px-5">
        <div className="flex flex-wrap gap-2 justify-center">
          {currentRound?.guessedLetters.sort((a, b) => LetterStateSortOrder[a.state] - LetterStateSortOrder[b.state]).map((evaluatedLetter, index) => (
            <div
              key={`${evaluatedLetter}-${index}`}
              className={`w-8 h-8 rounded border-2 flex items-center justify-center font-bold text-sm transition-colors duration-200 ${getLetterStyle(evaluatedLetter.state)}`}
            >
              {evaluatedLetter.letter.toUpperCase()}
            </div>
          ))}
        </div>
    </Card>
  );
}
