'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';

const USER_SESSION_LOCALSTORAGE_KEY: string = "user-session";

type AuthContextType = {  
  user: UserSessionModel | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSessionModel | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    getUserFromLocalStorage();
  }, []);

  const getUserFromLocalStorage = (): UserSessionModel | null => {
    const storedUser = localStorage.getItem(USER_SESSION_LOCALSTORAGE_KEY);
    if (!storedUser) return null;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    return parsedUser;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}
