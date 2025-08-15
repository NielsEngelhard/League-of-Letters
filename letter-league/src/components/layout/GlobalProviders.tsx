'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";
import { MessageBarProvider } from "./MessageBarContext";
import { ActiveGameProvider } from "@/features/game/components/active-game-context";
import { AccountProvider } from "@/features/user/account-context";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
    <MessageBarProvider>
      <AuthProvider>
        <AccountProvider>
          <ActiveGameProvider>
            <SocketProvider>
                {children}
            </SocketProvider>              
          </ActiveGameProvider>
        </AccountProvider>
      </AuthProvider>        
    </MessageBarProvider>
  );
}