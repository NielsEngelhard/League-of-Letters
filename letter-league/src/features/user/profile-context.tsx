"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsSchema } from './profile-schemas';
import { useAuth } from '../auth/AuthContext';

const DEFAULT_SETTINGS: SettingsSchema = {
  keyboardInput: "on-screen-keyboard",
  playBackgroundMusic: true,
  playSoundEffects: true,
  theme: "light"
}

interface ProfileContextType {
  settings: SettingsSchema;
  setSettingsOnClient: (s: SettingsSchema) => void;
  saveSettingsOnServer: (s: SettingsSchema) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ 
  children 
}) => {
  const authContext = useAuth();
  const [settings, setSettings] = useState<SettingsSchema>(DEFAULT_SETTINGS);

  function setSettingsOnClient(s: SettingsSchema) {
    setSettings(s);
  }

  async function saveSettingsOnServer(s: SettingsSchema) {
    console.log("save on server TODO");
  }

  useEffect(() => {
    if (!settings?.theme) return;
    console.log("THEME HAS BEEN CHANGED");
    const root = window.document.documentElement
    root.setAttribute('data-theme', settings.theme)    
  }, [settings.theme]);

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