import { useAuth } from "@/features/auth/AuthContext";
import { createContext, useContext } from "react";

export const soundEffects = ["button-hover", "button-click", "failing", "game-over", "success", "your-turn"] as const;
export type SoundEffect = (typeof soundEffects)[number];

type SoundPlayerContextType = {
    playEffect: (soundEffect: SoundEffect) => void;
}

const SoundPlayerContext = createContext<SoundPlayerContextType | undefined>(undefined);

export function SoundPlayerProvider({ children }: { children: React.ReactNode }) {
    const { settings } = useAuth();

    const playEffect = (soundEffect: SoundEffect) => {
        try {
            if (settings.playSoundEffects !== true) return;

            const audio = new Audio(`/sound/${soundEffect}.wav`);
            audio.play().catch(err => {
                console.log('Could not play sound:', err);
            });        
        } catch(err) {
            console.log('Could not play sound:', err);
        }
    };

    return (
        <SoundPlayerContext.Provider value={{ 
            playEffect
        }}>
            {children}
        </SoundPlayerContext.Provider>
    );    
}

export function useSounds() {
  const context = useContext(SoundPlayerContext);
  if (context === undefined) {
    throw new Error('useSounds must be used within an SoundPlayerContext');
  }
  return context;
}