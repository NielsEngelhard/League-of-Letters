"use client"

import { useAuth } from "@/features/auth/AuthContext"
import UnauthenticatedHeaderSection from "./UnAuthenticatedHeaderSection";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { LANGUAGE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE } from "@/app/routes";
import { GetLanguageStyle } from "@/features/language/LanguageStyles";
import GuestSessionTimeRemaining from "./GuestSessionTimeRemaining";
import { RefreshCw } from "lucide-react";
import HeaderConnectionStatus from "./HeaderConnectionStatus";

export default function HeaderUserClient({t, lang}: { t: GeneralTranslations, lang: SupportedLanguage}) {
    const { account } = useAuth();
    
    if (!account) {
        return <UnauthenticatedHeaderSection t={t} />
    }    

    const languageStyle = GetLanguageStyle(account.language);

    return (
    <div className="flex items-center gap-3">
        {/* Language Flag */}
        <Link className="cursor-pointer" href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)}>
            {languageStyle?.flag}
        </Link>

        {/* Guest Session Timer */}
        {account.isGuest && (
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
                            {account.username.charAt(0).toUpperCase()}
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
    )
}