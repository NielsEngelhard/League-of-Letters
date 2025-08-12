'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";
import { MessageBarProvider } from "./MessageBarContext";
import { ActiveGameProvider } from "@/features/game/components/active-game-context";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
    <MessageBarProvider>
        <AuthProvider>
          <ActiveGameProvider>
            <SocketProvider>
                {children}
            </SocketProvider>              
          </ActiveGameProvider>
      </AuthProvider>
    </MessageBarProvider>
  );
}