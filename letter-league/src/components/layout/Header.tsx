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

    console.log("language: " + account?.language);

    return (
        <header className="w-full h-[60px] fixed top-0 z-50 bg-background-secondary/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-4 md:px-6 h-full">
                {/* Left - Logo & Status */}
                <div className="flex flex-row items-center gap-3">
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
                    <WebSocketStatusIndicator />       
                </div>

                {/* Right - User Section */}
                {isLoggedIn && account ? (
                    <div className="flex items-center gap-2">
                        {/* Reconnect Button - Minimized */}
                        <Link
                            href={RECONNECT_ROUTE}
                            className="group relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-background/60 transition-all duration-200"
                            title="Reconnect"
                        >
                            <RefreshCw className="w-4 h-4 text-foreground-muted group-hover:text-foreground transition-colors duration-200" />
                        </Link>

                        {/* Guest Session Timer - Compact */}
                        {account.isGuest && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/40 border border-border/30">
                                <Clock className="w-3 h-3 text-foreground-muted" />
                                <span className="text-xs font-medium text-foreground-muted">
                                    {guestSessionTimeRemaining}                                    
                                </span> 
                            </div>
                        )}

                        {/* Profile Section - Redesigned */}
                        <Link 
                            href={PROFILE_ROUTE} 
                            className="group flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-background/50 transition-all duration-200 border border-transparent hover:border-border/30"
                        >
                            {/* User Avatar with Status */}
                            <div className="relative">
                                <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                                    <span className="text-background text-xs font-bold">
                                        {account.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {/* Minimal status indicator */}
                                {connectionStatus !== "empty" && (
                                    <div className="absolute -bottom-0.5 -right-0.5">
                                        <RealtimeStatusIndicator status={connectionStatus} showDot={true} showIcon={false} showLabel={false} />
                                    </div>                                
                                )}
                            </div>

                            {/* User Info - Clean Layout */}
                            <div className="hidden sm:flex flex-col min-w-0">
                                <div className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors duration-200 truncate">
                                    {account.username}
                                    {languageStyle?.flag}
                                </div>
                      
                                {account.isGuest && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs text-foreground-muted/80">Guest Session</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                ) : (
                    /* When unauthenticated - Enhanced */
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => setShowLoginModal(true)}
                        className="px-6 py-2 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        Play
                    </Button>
                )}
            </div>
            {showLoginModal && (
                <LoginModal />
            )}
        </header>
    )
}