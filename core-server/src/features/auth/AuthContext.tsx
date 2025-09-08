'use client';

import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { SettingsSchema } from '../account/account-schemas';
import { PublicAccountModel } from '../account/account-models';
import { LogoutCommand } from './actions/command/logout-command';
import { LoginModalState } from './components/LoginModal';

const DEFAULT_SETTINGS: SettingsSchema = {
  keyboardInput: "on-screen-keyboard",
  playBackgroundMusic: true,
  playSoundEffects: true,
  showKeyboardHints: true,
  showCompleteCorrect: false,
  theme: "light"
}

const ACCOUNT_LOCALSTORAGE_KEY: string = "account";

type AuthContextType = {
  account: PublicAccountModel | null;
  settings: SettingsSchema;
  isLoggedIn: boolean;
  loginModalState: LoginModalState;

  guestSessionTimeRemaining: string | null;

  clearAccountData: () => void;
  setLoginModalState: (loginModalState: LoginModalState) => void;
  setSettingsOnClient: (s: SettingsSchema) => void;
  updateAccount: (data: PublicAccountModel) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PublicAccountModel | null>(null);
  const [loginModalState, setLoginModalState] = useState<LoginModalState>(LoginModalState.Hidden);

  const [guestSessionTimeRemaining, setGuestSessionTimeRemaining] = useState<string | null>(null);

  // Initialize account from localStorage on mount
  useEffect(() => {
    try {
      const storedAccount = localStorage.getItem(ACCOUNT_LOCALSTORAGE_KEY);
      if (storedAccount) {
        const parsedAccount: PublicAccountModel = JSON.parse(storedAccount);
        setAccount(parsedAccount);
      }
    } catch (error) {
      console.error('Failed to parse stored account:', error);
      localStorage.removeItem(ACCOUNT_LOCALSTORAGE_KEY);
    }
  }, []);

  // For guest accounts check every 5 minutes if the auth token is still valid and otherwise set guestSessionStillValid to false
    useEffect(() => {
        if (account?.isGuest == false || !account?.tokenExpireUtcDate) return;

        const updateTimeRemaining = async () => {
            if (!account.tokenExpireUtcDate) return;

            const now = new Date();
            const diffMs = new Date(account.tokenExpireUtcDate).getTime() - now.getTime();

            const isExpired: boolean = diffMs <= 0;
            if (isExpired) {
                setGuestSessionTimeRemaining("Expired");
                clearAccountData();
                await LogoutCommand();
                return;
            }

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setGuestSessionTimeRemaining(`${hours}h ${minutes}m`);
            } else {
                setGuestSessionTimeRemaining(`${minutes}m`);
            }
        };

        updateTimeRemaining();
        const interval = setInterval(updateTimeRemaining, 60000 * 5); // Update every 5 minutes

        return () => clearInterval(interval);
    }, [account?.tokenExpireUtcDate]);  

  const clearAccountData = async (): Promise<void> => {
    try {
      localStorage.removeItem(ACCOUNT_LOCALSTORAGE_KEY);
      setAccount(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  async function updateAccount(data: PublicAccountModel) {
    setAccount(data);
    localStorage.setItem(ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(data));
    setLoginModalState(LoginModalState.Hidden);     
  }

  const setSettingsOnClient = (updatedSettings: SettingsSchema) => {
    setAccount(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        settings: updatedSettings
      };
    });
  };

  // Set account in local storage when the value is updated
  useEffect(() => {
    if (!account) return;

    localStorage.setItem(ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(account));
  }, [account]);

  return (
    <AuthContext.Provider value={{ 
      account,
      isLoggedIn: !!account,
      clearAccountData, 
      setLoginModalState,
      loginModalState,
      settings: account?.settings ?? DEFAULT_SETTINGS,
      setSettingsOnClient,
      guestSessionTimeRemaining,
      updateAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useIsLoggedIn(): boolean {
  const { isLoggedIn } = useAuth();
  return isLoggedIn;
}
