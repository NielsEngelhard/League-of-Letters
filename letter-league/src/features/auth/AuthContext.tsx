'use client';

import { z } from 'zod';
import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { loginSchema, SettingsSchema } from '../account/account-schemas';
import LoginCommand from './actions/command/login-command';
import { PublicAccountModel } from '../account/account-models';
import { LogoutCommand } from './actions/command/logout-command';
import CreateGuestSessionCommand from './actions/command/create-guest-session-command';
import { ServerResponse } from '@/lib/response-handling/response-factory';
import { SupportedLanguage } from '../i18n/languages';

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
  isLoading: boolean;  
  showLoginModal: boolean;

  guestSessionTimeRemaining: string | null;

  logout: () => void;
  login: (data: z.infer<typeof loginSchema>) => Promise<string | undefined>;
  loginWithGuestAccount: (language: SupportedLanguage) => Promise<string | undefined>;
  setShowLoginModal: (newValue: boolean) => void;
  setSettingsOnClient: (s: SettingsSchema) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PublicAccountModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    } finally {
      setIsLoading(false);
    }
  }, []);

  // For guest accounts check every 5 minutes if the auth token is still valid and otherwise set guestSessionStillValid to false
    useEffect(() => {
        if (account?.isGuest == false || !account?.tokenExpireUtcDate) return;

        const updateTimeRemaining = () => {
            if (!account.tokenExpireUtcDate) return;

            const now = new Date();
            const diffMs = new Date(account.tokenExpireUtcDate).getTime() - now.getTime();

            const isExpired: boolean = diffMs <= 0;
            if (isExpired) {
                setGuestSessionTimeRemaining("Expired");
                logout();
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

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await LogoutCommand();
      localStorage.removeItem(ACCOUNT_LOCALSTORAGE_KEY);
      setAccount(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server call fails
      localStorage.removeItem(ACCOUNT_LOCALSTORAGE_KEY);
      setAccount(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: z.infer<typeof loginSchema>): Promise<string | undefined> => {
    setIsLoading(true);
    try {
      const loginResponse = await LoginCommand(data);
      handleLoginResponse(loginResponse);      
      return undefined; // Success, no error message
    } catch (error) {
      console.error('Login failed:', error);
      return 'Login failed due to an unexpected error';
    } finally {
      setIsLoading(false);
    }
  };

  function handleLoginResponse(loginResponse: ServerResponse<PublicAccountModel>) {
      if (!loginResponse.ok) {
        return loginResponse.errorMsg;
      }

      const responseData: PublicAccountModel = loginResponse.data!;
          
      setAccount(responseData);

      setShowLoginModal(false);    
  }

  const loginWithGuestAccount = async (language: SupportedLanguage) => {
    setIsLoading(true);
    try {
      const guestLoginResponse = await CreateGuestSessionCommand({ language: language });
      handleLoginResponse(guestLoginResponse);      
      return undefined; // Success, no error message
    } catch (error) {
      console.error('Login failed:', error);
      return 'Login failed due to an unexpected error';
    } finally {
      setIsLoading(false);
    }
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
      isLoading,
      logout, 
      login,
      setShowLoginModal,
      showLoginModal,
      settings: account?.settings ?? DEFAULT_SETTINGS,
      loginWithGuestAccount,
      setSettingsOnClient,
      guestSessionTimeRemaining,
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
