'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";
import { ToasterProvider } from "../general/toaster/ToasterContext";
import { ActiveGameProvider } from "@/features/game/components/active-game-context";
import { SupportedLanguage } from "@/features/i18n/languages";

type Props = {
    lang: SupportedLanguage;
    actionsServerUrl: string;
    websocketPath: string;
    children: React.ReactNode;
}

export function Providers({ children, lang, actionsServerUrl, websocketPath }: Props) {
  return (
    <ToasterProvider>
      <AuthProvider>
        <ActiveGameProvider>
          <SocketProvider lang={lang} serverUrl={actionsServerUrl} path={websocketPath}>
              {children}
          </SocketProvider>              
        </ActiveGameProvider>
      </AuthProvider>        
    </ToasterProvider>
  );
}