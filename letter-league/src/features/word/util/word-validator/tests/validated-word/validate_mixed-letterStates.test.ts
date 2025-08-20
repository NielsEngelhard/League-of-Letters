import { LetterState } from "../../../../word-models";
import { WordStateFactory } from "../../../factories/word-state-factory";
import { WordValidator } from "../../word-validator";

describe("WordValidator - mixed letter states", () => {
  const testCases = [
    {
      description: "mix of correct and wrong letters (maken vs manen)",
      actualWord: "manen",
      guess: "maken",
      expected: [
        { letter: "M", state: LetterState.Correct },
        { letter: "A", state: LetterState.Correct },
        { letter: "K", state: LetterState.Wrong },
        { letter: "E", state: LetterState.Correct },
        { letter: "N", state: LetterState.Correct },
      ],
    },
    {
      description: "some correct, one misplaced, one wrong (stone vs notes)",
      actualWord: "stone",
      guess: "stoel",
      expected: [
        { letter: "S", state: LetterState.Correct },
        { letter: "T", state: LetterState.Correct },
        { letter: "O", state: LetterState.Correct },
        { letter: "E", state: LetterState.Misplaced },
        { letter: "L", state: LetterState.Wrong },
      ],
    },
    {
      description: "some correct, some wrong (apple vs ample)",
      actualWord: "apple",
      guess: "ample",
      expected: [
        { letter: "A", state: LetterState.Correct },
        { letter: "M", state: LetterState.Wrong },
        { letter: "P", state: LetterState.Correct },
        { letter: "L", state: LetterState.Correct },
        { letter: "E", state: LetterState.Correct },
      ],
    },
  ];

  test.each(testCases)(
    "should validate mixed guess correctly - $description",
    ({ actualWord, guess, expected }) => {
      
      const result = WordValidator.validate({
          actualWordState: WordStateFactory.create(actualWord),
          guess: guess,
          currentGuessIndex: 1,
          previouslyGuessedMisplacedLetters: []
      });

      expected.forEach((expectedItem, index) => {
          expect(result.evaluatedGuess[index]).toEqual(expect.objectContaining(expectedItem));
      });
    }
  );
});   