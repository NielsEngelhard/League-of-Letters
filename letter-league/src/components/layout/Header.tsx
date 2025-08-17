"use client"

import { PICK_GAME_MODE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import { useAuth } from "@/features/auth/AuthContext"
import Link from "next/link";
import WebSocketStatusIndicator from "./WebSocketStatusIndicator";
import RealtimeStatusIndicator from "@/features/realtime/RealtimeStatusIndicator";
import { useSocket } from "@/features/realtime/socket-context";
import Button from "../ui/Button";
import LoginModal from "@/features/account/components/LoginModal";
import { RefreshCw } from "lucide-react";

export default function Header() {
    const { isLoggedIn, account, setShowLoginModal, showLoginModal } = useAuth();
    const { connectionStatus } = useSocket();

    return (
        <header className="w-full h-[60px] fixed top-0 z-50 bg-background-secondary border-b-2 border-border shadow-xs">
            <div className="flex items-center justify-between max-w-4xl mx-auto px-2 md:px-0 h-full">
                {/* Left - Logo */}
            <div className="flex flex-row items-center gap-2">
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
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-secondary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300 blur-sm" />
                    </div>
                </Link>         

                <WebSocketStatusIndicator />       
            </div>
                {/* Right - User Section */}
                {isLoggedIn && account ? (
                    <div className="flex flex-row gap-2">
                        {/* Reconnect */}
                        <Link href={RECONNECT_ROUTE} className="flex flex-row items-center justify-center text-foreground-muted text-sm gap-1 cursor-pointer">
                            <RefreshCw className="w-4 h-4" />
                            <span>Try Reconnect</span>                    
                        </Link>

                        {/* Profile */}
                        <Link 
                            href={PROFILE_ROUTE} 
                            className="group flex items-center gap-3 p-2 pr-0 rounded-xl transition-all duration-200"
                        >
                            {/* User Avatar */}
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                                    <span className="text-foreground text-sm font-bold">
                                        {account.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                {/* Online indicator */}
                                {connectionStatus != "empty" && (
                                    <div className="absolute -bottom-0.5 -right-0.5 border-background border-2 rounded-full">
                                        <RealtimeStatusIndicator status={connectionStatus} showDot={true} showIcon={false} showLabel={false} />
                                    </div>                                
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col text-right">
                                <div className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200">
                                    {account.username}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-foreground-muted">
                                    {account.isGuest == true ? (
                                        <span className="font-medium">guest session</span>
                                    ) : (
                                        <span className="font-medium">user session</span>
                                    )}
                                </div>
                            </div>
                        </Link>                        
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