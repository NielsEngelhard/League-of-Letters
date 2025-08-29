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
    languageLabel: string,
    moreSettingsSoon: string,
    startButton: string;
    secondsPerGuessLabel: string;
  },
  online: {
    title: string;
    description: string;
    subDescription: string;
    joinGame: {
      title: string;
      description: string;
      inputLabel: string;
      btnText: string;
    };
    createGame: {
      title: string;
      description: string;
      extraDescription: string;
      btnText: string;
    };
  };  
  lobby: {
    create: {
      title: string;
      joinCode: string;
      joinLink: string;
    },
    join: {
      title: string;
      wating: string;
      players: string;      
    }
  }
}
