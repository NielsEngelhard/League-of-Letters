"use client"

import { PICK_GAME_MODE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import { useAuth } from "@/features/auth/AuthContext"
import Link from "next/link";

export default function Header() {
    const { authSession } = useAuth();

    return (
        <header className="w-full h-[60px] fixed top-0 z-50 bg-primary/5 border-b-2 border-border">
            <div className="flex items-center justify-between max-w-2xl mx-auto px-2 md:px-0 h-full">
                {/* Left - Logo */}
                <Link 
                    href={PICK_GAME_MODE_ROUTE}
                    className="group flex items-center transition-all duration-200"
                >
                    <div className="relative">
                        <img
                            src="/logo.png"
                            className="h-[40px] w-auto object-contain transition-all duration-200 group-hover:brightness-110"
                            alt="Logo"
                        />
                        {/* Subtle glow effect on hover */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 blur-sm" />
                    </div>
                </Link>

                {/* Right - User Section */}
                {authSession ? (
                    <Link 
                        href={PROFILE_ROUTE} 
                        className="group flex items-center gap-3 p-2 pr-0 rounded-xl transition-all duration-200"
                    >
                        {/* User Avatar */}
                        <div className="relative">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                                <span className="text-white text-sm font-bold">
                                    {authSession.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white shadow-sm">
                                <div className="w-full h-full bg-success rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex flex-col text-right">
                            <div className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
                                {authSession.username}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" />
                                <span className="font-medium">guest session</span>
                            </div>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* Login prompt for unauthenticated users */}
                        <div className="text-sm text-gray-500 hidden sm:block">
                            Ready to play?
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}