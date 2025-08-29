import { HOME_ROUTE, LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import Link from "next/link";
import WebSocketStatusIndicator from "../WebSocketStatusIndicator";
import LoginModal from "@/features/account/components/login-modal/LoginModal";
import { RefreshCw, Clock } from "lucide-react";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";
import { SupportedLanguage } from "@/features/i18n/languages";
import HeaderConnectionStatus from "./HeaderConnectionStatus";
import { getAuthenticatedUser_Server } from "@/features/auth/utils/auth-server-utils";
import UnauthenticatedHeaderSection from "./UnAuthenticatedHeaderSection";
import { loadTranslations } from "@/features/i18n/utils";
import GuestSessionTimeRemaining from "./GuestSessionTimeRemaining";

export default async function Header({ lang } : {lang: SupportedLanguage }) {
    const t = await loadTranslations(lang, ["general"]);
    const authPayload = await getAuthenticatedUser_Server();
    const languageStyle = GetLanguageStyle(authPayload?.language);

    return (
        <header className="w-full h-16 fixed top-0 z-50 bg-background-secondary/80 backdrop-blur-xl border-b border-border/20 shadow-sm">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-full">
                {/* Left - Logo & Status */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={authPayload ? LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE) : LANGUAGE_ROUTE(lang, HOME_ROUTE)}
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
                {authPayload ? (
                    <div className="flex items-center gap-3">
                        {/* Language Flag */}
                        <div className="flex items-center justify-center w-8 h-8 text-lg rounded-full bg-background/40 border border-border/30">
                            {languageStyle?.flag}
                        </div>

                        {/* Guest Session Timer */}
                        {authPayload.isGuest && (
                            <GuestSessionTimeRemaining />
                        )}

                        {/* Reconnect Button */}
                        <Link
                            href={LANGUAGE_ROUTE(lang, RECONNECT_ROUTE)}
                            className="group relative flex items-center justify-center w-9 h-9 rounded-full bg-background/40 hover:bg-background/60 border border-border/20 hover:border-border/40 transition-all duration-200"
                            title="Reconnect to game"
                        >
                            <RefreshCw className="w-4 h-4 text-foreground-muted group-hover:text-foreground group-hover:rotate-180 transition-all duration-300" />
                        </Link>

                        {/* Profile Section */}
                        <Link 
                            href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} 
                            className="group flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-background/30 hover:bg-background/50 border border-border/20 hover:border-primary/30 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
                        >
                            {/* Avatar with gradient border */}
                            <div className="relative">
                                <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-br from-primary to-secondary">
                                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                                        <span className="text-sm font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                            {authPayload.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Status dot */}
                                <HeaderConnectionStatus />
                            </div>

                            {/* User Info */}
                            <div className="hidden sm:flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200 truncate">
                                        {authPayload.username}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-foreground-muted/80 font-medium">
                                        {authPayload.isGuest ? 'Guest' : 'Member'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ) : (
                    <UnauthenticatedHeaderSection t={t.general} />
                )}
            </div>
            
            <LoginModal />
        </header>
    )
}