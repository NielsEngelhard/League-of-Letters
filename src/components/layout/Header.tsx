"use client"

import { PICK_GAME_MODE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import { useAuth } from "@/features/auth/AuthContext"
import Link from "next/link";

export default function Header() {
    const { authSession } = useAuth();

    return (
        <header className="w-full h-[60px] bg-background fixed flex flex-row justify-center border-b-2 border-border">
            <div className="flex flex-row justify-between max-w-2xl px-2 w-full items-center h-full">
                {/* Left */}
                <Link href={PICK_GAME_MODE_ROUTE}>
                    <img
                        src="/logo.png"
                        className="h-[40px] w-auto object-contain"
                    />
                </Link>

                {/* Right */}
                { authSession ? (
                    <Link href={PROFILE_ROUTE} className="flex flex-col text-foreground-muted text-end">
                        <div className="text-sm font-medium">{authSession.username}</div>
                        <div className="text-xs text-primary/50 font-bold">guest session</div>
                    </Link>
                ) : (
                    <div className="text-sm text-foreground-muted">
                        
                    </div>
                )}
            </div>
        </header>
    )
}