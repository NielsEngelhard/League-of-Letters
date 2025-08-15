'use client';

import { createContext, useState, ReactNode, useContext } from 'react';
import { AuthSessionModel } from './auth-models';
import { loginSchema } from '../account/account-schemas';
import { z } from 'zod';
import LoginCommand from './actions/command/login-command';
import { PublicAccountModel } from '../account/account-models';
import { LogoutCommand } from './actions/command/logout-command';

const ACCOUNT_LOCALSTORAGE_KEY: string = "account";

type AuthContextType = {
  authSession: AuthSessionModel | null;
  logout: () => void;

  login: (data: z.infer<typeof loginSchema>) => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);
  const [account, setAccount] = useState<PublicAccountModel | null>(null);

  // Check for existing session on mount
  // useEffect(() => {
  //   getAuthSessionFromLocalStorage();
  // }, []);

  // const getAuthSessionFromLocalStorage = (): AuthSessionModel | null => {
  //   try {
  //     const storedAuthSession = localStorage.getItem(AUTH_SESSION_LOCALSTORAGE_KEY);
  //     if (!storedAuthSession) return null;

  //     const parsedAuthSession = JSON.parse(storedAuthSession);
  //     setAuthSession(parsedAuthSession);

  //     return parsedAuthSession;      
  //   } catch {
  //     console.log("ERROR while retrieving auth session from local storage");
  //     return null;
  //   }
  // }

  // const setAuthSessionInLocalStorage = (authSession: AuthSessionModel): void => {
  //   try {
  //     const jsonString = JSON.stringify(authSession);
  //     localStorage.setItem(AUTH_SESSION_LOCALSTORAGE_KEY, jsonString);      
  //   } catch {
  //     console.log("ERROR while setting auth session in local storage");
  //   }
  // }

  // const getOrCreateGuestAuthSession = async (): Promise<AuthSessionModel> => {
  //   const existingAuthSession = getAuthSession();
  //   if (existingAuthSession) return existingAuthSession;

  //   // Create and get from server
  //   const newAuthSession = await createAuthSessionOnServer();
  //   if (!newAuthSession) throw Error("Could not setup a auth guest session ...");

  //   setAuthSession(newAuthSession);
  //   setAuthSessionInLocalStorage(newAuthSession);

  //   return newAuthSession;
  // }

  // const getAuthSession = (): AuthSessionModel | null => {
  //   if (authSession) return authSession;

  //   const userFromLocalStorage = getAuthSessionFromLocalStorage();

  //   return userFromLocalStorage;
  // }

  const logout = async (): Promise<void> => {
    try {
      await LogoutCommand();
      localStorage.clear();
    } finally {
      setAuthSession(null);
    }
  }

  const login = async (data: z.infer<typeof loginSchema>): Promise<string | undefined> => {
    var loginResponse = await LoginCommand(data);
    if (!loginResponse.ok) return loginResponse.errorMsg;

    const responseData: PublicAccountModel = loginResponse.data!;

    localStorage.setItem(ACCOUNT_LOCALSTORAGE_KEY, JSON.stringify(responseData));
    setAccount(responseData);
  };  

  return (
    <AuthContext.Provider value={{ authSession, logout, login }}>
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
