export interface SettingsTranslations {
    account: {
        title: string;
        memberSince: string;
        statistics: {
            title: string;
            played: string;
            highestScore: string;
            favouriteWord: string;
            updateDisclaimer: string;
        };
        logoutButton: string;
        profileTab: string;
        settingsTab: string;
        accountType: {
            member: string;
            guest: string;
        }
    },
    profile: {
        updateLanguage: {
            title: string;
            button: string;
        },
        updateAccount: {
            title: string;
            favWordLabel: string;
            button: string;
        },
        updatePassword: {
            title: string;
            oldLabel: string;
            newLabel: string;
            button: string;
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
  },
  upgradeGuestAccount: {
    title: string;
    description: string;
    passwordLabel: string;
    buttonText: string;
  }
}