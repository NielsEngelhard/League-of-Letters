'use client';

import { AuthProvider } from "@/features/auth/AuthContext";
import { ActiveGameProvider } from "@/features/game/components/active-game-context";

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
        <AuthProvider>
          <ActiveGameProvider>
            {children}
          </ActiveGameProvider>
        </AuthProvider>
  );
}