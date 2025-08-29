export default interface BeforeGameTranslations {
  gameMode: {
    description: string;
    solo: {
      title: string;
      description: string;
      btn: string;
    };
    multiplayer: {
      title: string;
      description: string;
      btn: string;
    };
    scoreRedirect: {
      sentence: string;
      clickHere: string;
    };
  }
  createGameForm: {
    title: string,
    description: string,
    wordLengthLabel: string,
    totalRoundsLabel: string,
    withStartingLetterLabel: string,
    moreSettingsSoon: string,
    startButton: string;
    secondsPerGuessLabel: string;
  }
}