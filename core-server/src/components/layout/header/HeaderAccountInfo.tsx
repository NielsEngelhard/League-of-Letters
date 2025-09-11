"use server"

import UnauthenticatedHeaderSection from "./UnAuthenticatedHeaderSection";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { LANGUAGE_ROUTE, PROFILE_ROUTE } from "@/app/routes";
import { JwtAccountPayload } from "@/features/auth/jwt/jwt-models";
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import HeaderWebSocketStatusIndicator from "./HeaderWebSocketStatusIndicator";

export default async function HeaderAccountInfo({t, lang, account}: { t: GeneralTranslations, lang: SupportedLanguage, account: JwtAccountPayload | null}) {
    if (!account) {
        return <UnauthenticatedHeaderSection t={t} />
    }    

    return (
    <div className="flex items-center gap-3">

        {/* Websocket status indicator (live, disconnected etc.) */}
        <HeaderWebSocketStatusIndicator />

        {/* Language Flag */}
        <HeaderLanguagePicker />

        {/* Profile Section */}
        <Link 
            href={LANGUAGE_ROUTE(lang, PROFILE_ROUTE)} 
            className="flex items-center gap-3 pl-2 pr-4 py-2"
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
            </div>

            {/* User Info */}
            <div className="hidden sm:flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground/90 group-hover:text-foreground transition-colors duration-200 truncate">
                        {account.username}
                    </span>
                </div>
                
                <span className="text-xs text-foreground-muted/60 font-medium">
                    {account.isGuest ? t.accountType.guest : t.accountType.member}
                </span>
            </div>
        </Link>
    </div>        
    )
}