'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { SocketProvider } from "@/features/realtime/socket-context";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
        <AuthProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </AuthProvider>
  );
}