export default interface BeforeGameTranslations {
  gameMode: {
    title: string;
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
    wordLengthOptions: {
      four: string;
      five: string;
      six: string;
      seven: string;
      eight: string;
      nine: string;
      ten: string;
      eleven: string;
      twelve: string;
    }
  },
  online: {
    title: string;
    description: string;
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
    searchGame: {
      title: string;
      description: string;
      btnText: string;
    }
  };  
  lobby: {
    create: {
      title: string;
    },
    join: {
      title: string;
      wating: string;
      players: string;
      joinCode: {
        label: string;
        description: string;
      },
      joinUrl: {
        label: string;
        description: string;
      },
      share: {
        title: string;
        description: string;
      }
    }
  }
}
