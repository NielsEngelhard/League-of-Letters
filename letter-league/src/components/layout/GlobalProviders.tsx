'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";
import { MessageBarProvider } from "./MessageBarContext";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
    <MessageBarProvider>
        <AuthProvider>
          <SocketProvider>
              {children}
          </SocketProvider>
      </AuthProvider>
    </MessageBarProvider>
  );
}