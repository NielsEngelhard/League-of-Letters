"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SettingsSchema } from './account-schemas';
import { useAuth } from '../auth/AuthContext';
import { ThemeOption } from './account-models';

const SETTINGS_LOCAL_STORAGE_KEY = "SETTINGS";

const DEFAULT_SETTINGS: SettingsSchema = {
  keyboardInput: "on-screen-keyboard",
  playBackgroundMusic: true,
  playSoundEffects: true,
  theme: "light"
}

interface AccountContextType {
  settings: SettingsSchema;
  setSettingsOnClient: (s: SettingsSchema) => void;
  saveSettingsOnServer: (s: SettingsSchema) => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ 
  children 
}) => {
  const authContext = useAuth();
  const [settings, setSettings] = useState<SettingsSchema>(DEFAULT_SETTINGS);

  // Initial setup
  useEffect(() => {
    const intitialSettings = getLocalSettingsOrDefault();
    setSettings(intitialSettings);
  }, []);

  function getLocalSettingsOrDefault(): SettingsSchema {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_LOCAL_STORAGE_KEY);
      if (!storedSettings) return DEFAULT_SETTINGS;

      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);

      return parsedSettings;      
    } catch {
      return DEFAULT_SETTINGS;
    }    
  }

  function trySetSettingsInLocalStorage(s: SettingsSchema) {
    try {
      const jsonString = JSON.stringify(s);
      localStorage.setItem(SETTINGS_LOCAL_STORAGE_KEY, jsonString);  
    } catch(err) {
      console.log("Could not set settings in local storage " + err);
    }
  }

  function setSettingsOnClient(s: SettingsSchema) {
    setSettings(s);
    trySetSettingsInLocalStorage(s);
  }

  async function saveSettingsOnServer(s: SettingsSchema) {
    console.log("save on server TODO");
  }

  function setThemeInRoot(theme: ThemeOption) {
    const root = window.document.documentElement
    root.setAttribute('data-theme', theme)   
  }

  useEffect(() => {
    if (!settings?.theme) return;
    setThemeInRoot(settings.theme);
  }, [settings.theme]);

  return (
    <AccountContext.Provider value={{
      settings,
      setSettingsOnClient,
      saveSettingsOnServer
    }}>
      {children}
    </AccountContext.Provider>
  );
};

// Custom hook to use the account context
export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within a AccountProvider');
  }
  return context;
};