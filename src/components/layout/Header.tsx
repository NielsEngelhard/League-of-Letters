"use client"

import { useAuth } from "@/features/auth/AuthContext"

export default function Header() {
    const { authSession } = useAuth();

    return (
        <header className="w-full h-[60px] bg-background fixed flex flex-row justify-center border-b-2 border-border">
            <div className="flex flex-row justify-between max-w-2xl px-2 w-full items-center h-full">
                {/* Left */}
                <div className="text-xs">
                    <img
                        src="/logo.png"
                        className="h-[40px] w-auto object-contain"
                    />
                </div>

                {/* Right */}
                { authSession ? (
                    <div className="flex flex-col text-foreground-muted text-end">
                        <div className="text-sm font-medium">{authSession.username}</div>
                        <div className="text-xs text-primary/50 font-bold">guest session</div>
                    </div>
                ) : (
                    <div className="text-sm text-foreground-muted">
                        
                    </div>
                )}
            </div>
        </header>
    )
}