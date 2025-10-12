"use server"

import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import Image from "next/image";
import HeaderAccountInfo from "./HeaderAccountInfo";
import { Authenticate_Server } from "@/features/auth/current-user";
import LoginModal from "@/features/auth/components/LoginModal";
import DesktopSubHeader from "./DesktopSubHeader";
import { ACCOUNT_SETTINGS_ROUTE, CREATE_MULTIPLAYER_GAME_ROUTE, HOME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PICK_GAME_MODE_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import MobileSubHeader from "./MobileSubHeader";

export interface HeaderNavigationItem {
    label: string;
    href: string;
    icon: string;
}

export default async function Header({ lang } : {lang: SupportedLanguage }) {
    const t = await loadTranslations(lang, ["general"]);
    
    const currentUser = await Authenticate_Server();

    const mainNavItems = [
        { label: t.general.nav.soloGame, href: LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE), icon: "🎯" },
        { label: t.general.nav.onlineGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🌐" },
        { label: t.general.nav.createGame, href: LANGUAGE_ROUTE(lang, CREATE_MULTIPLAYER_GAME_ROUTE), icon: "➕" },
        { label: t.general.nav.joinGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🔗" },
        { label: "Reconnect", href: LANGUAGE_ROUTE(lang, RECONNECT_ROUTE), icon: "🔄" }
    ];

    const subNavItems = [
        { label: t.general.nav.settings, href: LANGUAGE_ROUTE(lang, ACCOUNT_SETTINGS_ROUTE), icon: "⚙️"},
        { label: t.general.nav.scoreSystem, href: LANGUAGE_ROUTE(lang, SCORE_ROUTE), icon: "📊" },
        { label: t.general.nav.profile, href: LANGUAGE_ROUTE(lang, PROFILE_ROUTE), icon: "👤" }
    ];

    return (
        <header className="fixed flex flex-col z-50 w-full">
            {/* Main header */}
            <div className="w-full bg-background-secondary border-b border-border/20 shadow-sm py-1">
                <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-full">
                    {/* Left - Logo & Status */}
                    <div className="relative">
                        <Link
                            href={currentUser ? LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE) : LANGUAGE_ROUTE(lang, HOME_ROUTE)}
                            className="group flex items-center w-fit pl-2 h-full"
                        >
                            <Image
                            src="/logo.png"
                            className="object-contain transition-all duration-300 ease-out group-hover:brightness-110"
                            alt="Logo"
                            width={60}
                            height={30}
                            />
                        </Link>
                        <div className="absolute w-full h-full flex items-center justify-center">
                            <span className="text-[0.55rem] text-foreground-muted font-monos opacity-60 align-bottom h-full">
                                {process.env.APP_VERSION}
                            </span>
                        </div>
                    </div>
   

                    <div className="flex items-center gap-4">
                        {/* Right - User Section */}
                        <HeaderAccountInfo
                            t={t.general}
                            lang={lang}
                            account={currentUser}
                        />

                        {/* Mobile navigation dropdown */}
                        <MobileSubHeader
                            lang={lang}
                            t={t.general}               
                        />                        
                    </div>                  
                </div>
                
                
            </div>

            {/* DESKTOP - Sub header nav menu */}
            {currentUser && (
                <div className="hidden md:flex justify-center w-full">
                    <div className="max-w-6xl px-6 w-full">
                        <DesktopSubHeader 
                            mainNavItems={mainNavItems}
                            subNavItems={subNavItems}
                        />
                    </div>
                </div>                
            )}            

            <LoginModal t={t.general} lang={lang} />                        
        </header>
    )
}