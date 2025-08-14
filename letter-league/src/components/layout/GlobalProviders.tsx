'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";
import { MessageBarProvider } from "./MessageBarContext";
import { ActiveGameProvider } from "@/features/game/components/active-game-context";
import { ProfileProvider } from "@/features/user/profile-context";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
    <MessageBarProvider>
      <ProfileProvider>
        <AuthProvider>
          <ActiveGameProvider>
            <SocketProvider>
                {children}
            </SocketProvider>              
          </ActiveGameProvider>
        </AuthProvider>        
      </ProfileProvider>
    </MessageBarProvider>
  );
}