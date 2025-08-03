'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { AuthSessionModel } from './auth-models';
import CreateAuthSession from './actions/command/create-auth-session';

const AUTH_SESSION_LOCALSTORAGE_KEY: string = "auth-session";

type AuthContextType = {  
  authSession: AuthSessionModel | null;
  getOrCreateGuestAuthSession: () => Promise<AuthSessionModel>;
  getAuthSession: () => AuthSessionModel | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    getAuthSessionFromLocalStorage();
  }, []);

  const getAuthSessionFromLocalStorage = (): AuthSessionModel | null => {
    try {
      const storedAuthSession = localStorage.getItem(AUTH_SESSION_LOCALSTORAGE_KEY);
      if (!storedAuthSession) return null;

      const parsedAuthSession = JSON.parse(storedAuthSession);
      setAuthSession(parsedAuthSession);

      return parsedAuthSession;      
    } catch {
      console.log("ERROR while retrieving auth session from local storage");
      return null;
    }
  }

  const setAuthSessionInLocalStorage = (authSession: AuthSessionModel): void => {
    try {
      const jsonString = JSON.stringify(authSession);
      localStorage.setItem(AUTH_SESSION_LOCALSTORAGE_KEY, jsonString);      
    } catch {
      console.log("ERROR while setting auth session in local storage");
    }
  }

  const createAuthSessionOnServer = async (): Promise<AuthSessionModel> => {
    return await CreateAuthSession();
  }

  const getOrCreateGuestAuthSession = async (): Promise<AuthSessionModel> => {
    const existingAuthSession = getAuthSession();
    if (existingAuthSession) return existingAuthSession;

    // Create and get from server
    const newAuthSession = await createAuthSessionOnServer();
    if (!newAuthSession) throw Error("Could not setup a auth guest session ...");

    setAuthSession(newAuthSession);
    setAuthSessionInLocalStorage(newAuthSession);

    return newAuthSession;
  }

  const getAuthSession = (): AuthSessionModel | null => {
    if (authSession) return authSession;

    const userFromLocalStorage = getAuthSessionFromLocalStorage();

    return userFromLocalStorage;
  }

  return (
    <AuthContext.Provider value={{ authSession, getOrCreateGuestAuthSession, getAuthSession }}>
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
