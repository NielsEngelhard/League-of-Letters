export interface GeneralTranslations {
  startButton: string;
  logoutButton: string;
  continueButton: string;
  authRequired: {
    title: string;
    description: string;
  },
  letterState: {
      correct: string;
      close: string;
      wrong: string;
  },  
  login: {
    login: {
      title: string;
      description: string;
      usernameLabel: string;
      usernamePlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      guestButton: string;
      loginButton: string;
      signUpButton: string;    
      backToLoginButton: string;        
    },
    signUp: {
      title: string;
      description: string;
      emailLabel: string;
      emailPlaceholder: string;
      usernameLabel: string;
      usernamePlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      signUpButton: string;
    },
    guest: {
      title: string;
      description: string;
      createGuestSessionButton: string;
      guestDisclaimer: string;
    }
  },
  account: {
    title: string;
    guestDisclaimerTitle: string;
    guestDisclaimerDescription: string;
    memberSince: string;
    guestIndicator: string;
    memberIndicator: string;
    gameStatistics: {
      title: string;
      winsLabel: string;
      leftGamesLabel: string;
      favouriteWordLabel: string;
    },
    accountSettings: {
      title: string;
      updateDescription: string;
    }
  },
  settings: {
    title: string;
    description: string;
    minimize: string;
    maximize: string;
    saveButton: string;
    featureGroups: {
      appearanceLabel: string;
      keyboardInputLabel: string;
      audioLabel: string;
    }
    features: {
      theme: {
        title: string;
        description: string;
      },
      keyboardInput: {
        title: string;
        description: string;
      },
      showKeyboardHints: {
        title: string;
        description: string;
      },
      highlightCompleteLetters: {
        title: string;
        description: string;
      },
      preFill: {
        title: string;
        description: string;
      },
      enableSoundEffects: {
        title: string;
        description: string;
      },
      enableBackgroundMusic: {
        title: string;
        description: string;
      }
    }
  }
}