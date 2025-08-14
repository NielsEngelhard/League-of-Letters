"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsSchema } from './profile-schemas';

interface ProfileContextType {
  settings: SettingsSchema | null;
  setSettingsOnClient: (s: SettingsSchema) => void;
  saveSettingsOnServer: (s: SettingsSchema) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ 
  children 
}) => {
  const [settings, setSettings] = useState<SettingsSchema | null>(null);

  function setSettingsOnClient(s: SettingsSchema) {
    setSettings(s);
  }

  function saveSettingsOnServer(s: SettingsSchema) {
    setSettings(s);
  }

  useEffect(() => {
    console.log("THEME HAS BEEN CHANGED");
  }, [settings?.theme]);

  return (
    <ProfileContext.Provider value={{
      settings,
      setSettingsOnClient,
      saveSettingsOnServer
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};