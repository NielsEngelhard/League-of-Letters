"use client"
import { PICK_GAME_MODE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import { useAuth } from "@/features/auth/AuthContext"
import Link from "next/link";
import WebSocketStatusIndicator from "./WebSocketStatusIndicator";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { useSocket } from "@/features/realtime/socket-context";
import Button from "../ui/Button";
import LoginModal from "@/features/account/components/LoginModal";
import { RefreshCw, Clock } from "lucide-react";

export default function Header() {
    const { isLoggedIn, account, setShowLoginModal, showLoginModal, guestSessionTimeRemaining } = useAuth();
    const { connectionStatus } = useSocket();

    return (
        <header className="w-full h-[60px] fixed top-0 z-50 bg-background-secondary/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-4 md:px-6 h-full">
                {/* Left - Logo & Status */}
                <div className="flex flex-row items-center gap-3">
                    <Link 
                        href={PICK_GAME_MODE_ROUTE}
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
                    <div className="flex flex-row items-center gap-3">
                        {/* Reconnect Button */}
                        <Link href={RECONNECT_ROUTE}>
                            <Button 
                                variant="skeleton" 
                                size="sm" 
                                className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors duration-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="hidden sm:inline">Reconnect</span>
                            </Button>
                        </Link>

                        {/* Profile Section */}
                        <Link 
                            href={PROFILE_ROUTE} 
                            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-all duration-200"
                        >
                            {/* User Avatar */}
                            <div className="relative">
                                <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                                    <span className="text-foreground text-sm font-bold">
                                        {account.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {/* Online indicator */}
                                {connectionStatus !== "empty" && (
                                    <div className="absolute -bottom-0.5 -right-0.5 border-background border-2 rounded-full">
                                        <RealtimeStatusIndicator status={connectionStatus} showDot={true} showIcon={false} showLabel={false} />
                                    </div>                                
                                )}
                            </div>

                            {/* User Info - Hidden on mobile */}
                            <div className="hidden md:flex flex-col">
                                <div className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                                    {account.username}
                                </div>
                                <div className="flex items-center gap-1.5 text-xs">
                                    {account.isGuest ? (
                                        <>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span className={`font-medium transition-colors duration-200 text-foreground-muted`}>
                                                    {guestSessionTimeRemaining}
                                                </span>
                                            </div>
                                            <span className="text-foreground-muted/60">•</span>
                                            <span className="text-foreground-muted font-medium">Guest</span>
                                        </>
                                    ) : (
                                        <span className="text-foreground-muted font-medium">User</span>
                                    )}
                                </div>
                            </div>
                        </Link>

                        {/* Mobile Token Expiration Indicator */}
                        {account.isGuest && (
                            <div className="md:hidden flex items-center gap-1 px-2 py-1 rounded-md bg-background/50">
                                <Clock className="w-3 h-3" />
                                <span className={`text-xs font-medium transition-colors duration-200 text-foreground-muted`}>
                                    {guestSessionTimeRemaining}
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    /* When unauthenticated */
                    <Button variant="primary" size="sm" onClick={() => setShowLoginModal(true)}>
                        Login
                    </Button>
                )}
            </div>
            {showLoginModal && (
                <LoginModal />
            )}
        </header>
    )
}