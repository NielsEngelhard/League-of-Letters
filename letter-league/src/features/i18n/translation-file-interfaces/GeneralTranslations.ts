export interface GeneralTranslations {
  startButton: string;
  logoutButton: string;
  continueButton: string;
  authRequired: {
    title: string;
    description: string;
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
  }
}