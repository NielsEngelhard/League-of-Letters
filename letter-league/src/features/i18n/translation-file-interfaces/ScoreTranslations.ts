export default interface ScoreTranslations {
  title: string;
  description: string;
  letterScores: {
    title: string;
    allCorrect: string;
    wrongPosition: string;
    correctAfterMisplaced: string;
  };
  wordGuessedScores: {
    title: string;
    correctGuess: string;
    correctInFirstGuessBonus: string;
    correctInSecondGuessBonus: string;
  };
  proTip: string;    
}