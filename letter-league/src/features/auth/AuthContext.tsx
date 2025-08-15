'use client';

import { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { loginSchema, SettingsSchema } from '../account/account-schemas';
import { z } from 'zod';
import LoginCommand from './actions/command/login-command';
import { PublicAccountModel } from '../account/account-models';
import { LogoutCommand } from './actions/command/logout-command';

const DEFAULT_SETTINGS: SettingsSchema = {
  keyboardInput: "on-screen-keyboard",
  playBackgroundMusic: true,
  playSoundEffects: true,
  theme: "light"
}

const ACCOUNT_LOCALSTORAGE_KEY: string = "account";

type AuthContextType = {
  account: PublicAccountModel | null;
  settings: SettingsSchema;
  isLoggedIn: boolean;
  isLoading: boolean;  
  showLoginModal: boolean;

  logout: () => void;
  login: (data: z.infer<typeof loginSchema>) => Promise<string | undefined>;
  toggleLoginModal: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PublicAccountModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
      if (!loginResponse.ok) {
        return loginResponse.errorMsg;
      }

      const responseData: PublicAccountModel = loginResponse.data!;
      
      localStorage.setItem(ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(responseData));
      setAccount(responseData);

      setShowLoginModal(false);
      
      return undefined; // Success, no error message
    } catch (error) {
      console.error('Login failed:', error);
      return 'Login failed due to an unexpected error';
    } finally {
      setIsLoading(false);
    }
  };

  function toggleLoginModal() {
    // already logged in so dont show modal
    if (!!account) {
      setShowLoginModal(false);
      return;
    };

    setShowLoginModal(prev => !prev);
  }

  return (
    <AuthContext.Provider value={{ 
      account,
      isLoggedIn: !!account,
      isLoading,
      logout, 
      login,
      toggleLoginModal,
      showLoginModal,
      settings: account?.settings ?? DEFAULT_SETTINGS
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
