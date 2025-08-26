"use client"

import { HOME_ROUTE, PICK_GAME_MODE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import { useAuth } from "@/features/auth/AuthContext"
import Link from "next/link";
import WebSocketStatusIndicator from "./WebSocketStatusIndicator";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { useSocket } from "@/features/realtime/socket-context";
import Button from "../ui/Button";
import LoginModal from "@/features/account/components/login-modal/LoginModal";
import { RefreshCw, Clock } from "lucide-react";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";

export default function Header() {
    const { isLoggedIn, account, setShowLoginModal, showLoginModal, guestSessionTimeRemaining } = useAuth();
    const { connectionStatus } = useSocket();

    const languageStyle = GetLanguageStyle(account?.language);

    return (
        <header className="w-full h-16 fixed top-0 z-50 bg-background-secondary/80 backdrop-blur-xl border-b border-border/20 shadow-sm">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-full">
                {/* Left - Logo & Status */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={account ? PICK_GAME_MODE_ROUTE : HOME_ROUTE}
                        className="group flex items-center transition-all duration-200"
                    >
                        <div className="relative">
                            <img
                                src="/logo.png"
                                className="h-[36px] w-auto object-contain transition-all duration-200 group-hover:brightness-110"
                                alt="Logo"
                            />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300 blur-sm" />
                        </div>
                    </Link>                     
                    
                    {/* Status Indicator */}
                    <div className="hidden sm:block">
                        <WebSocketStatusIndicator />
                    </div>
                </div>

                {/* Right - User Section */}
                {isLoggedIn && account ? (
                    <div className="flex items-center gap-3">
                        {/* Language Flag */}
                        <div className="flex items-center justify-center w-8 h-8 text-lg rounded-full bg-background/40 border border-border/30">
                            {languageStyle?.flag}
                        </div>

                        {/* Guest Session Timer */}
                        {account.isGuest && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-700">
                                    {guestSessionTimeRemaining}
                                </span>
                            </div>
                        )}

                        {/* Reconnect Button */}
                        <Link
                            href={RECONNECT_ROUTE}
                            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-background/40 hover:bg-background/60 border border-border/20 hover:border-border/40 transition-all duration-200"
                            title="Reconnect to game"
                        >
                            <RefreshCw className="w-4 h-4 text-foreground-muted group-hover:text-foreground group-hover:rotate-180 transition-all duration-300" />
                        </Link>

                        {/* Profile Section */}
                        <Link 
                            href={PROFILE_ROUTE} 
                            className="group flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-background/30 hover:bg-background/50 border border-border/20 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                        >
                            {/* Avatar with gradient border */}
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-br from-primary to-secondary">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                        <span className="text-sm font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                            {account.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Status dot */}
                                {connectionStatus !== "empty" && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background">
                                        <RealtimeStatusIndicator status={connectionStatus} showDot={true} showIcon={false} showLabel={false} />
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="hidden sm:flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200 truncate">
                                        {account.username}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-foreground-muted/80 font-medium">
                                        {account.isGuest ? 'Guest' : 'Member'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    /* Unauthenticated State */
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={() => setShowLoginModal(true)}
                            className="px-6 py-2.5 font-semibold transition-all duration-300 hover:scale-105"
                        >
                            <span className="flex items-center gap-2">
                                Start Playing
                                <Sparkles className="w-4 h-4" />
                            </span>
                        </Button>
                    </div>
                )}
            </div>
            
            {showLoginModal && <LoginModal />}
        </header>
    )
}