"use client";

import { ACCOUNT_SETTINGS_ROUTE, CREATE_MULTIPLAYER_GAME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    t: GeneralTranslations;
    lang: SupportedLanguage;
}

export default function SubHeader({t, lang}: Props) {
    const [isInGame, setIsInGame] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathName = usePathname();
    
    // Dont show the subnavbar (on mobile) when in game (it blocks the keyboard)
    useEffect(() => {
        if (pathName.includes('/connect/')) {
            setIsInGame(true);
        } else {
            setIsInGame(false);
        }
    }, [pathName]);

    const mainNavItems = [
        { label: t.nav.soloGame, href: LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE), icon: "🎯" },
        { label: t.nav.onlineGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🌐" },
        { label: t.nav.createGame, href: LANGUAGE_ROUTE(lang, CREATE_MULTIPLAYER_GAME_ROUTE), icon: "➕" },
        { label: t.nav.joinGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🔗" },
        { label: "Reconnect", href: LANGUAGE_ROUTE(lang, RECONNECT_ROUTE), icon: "🔄" }
    ];

    const subNavItems = [
        { label: t.nav.settings, href: LANGUAGE_ROUTE(lang, ACCOUNT_SETTINGS_ROUTE), icon: "⚙️"},
        { label: t.nav.scoreSystem, href: LANGUAGE_ROUTE(lang, SCORE_ROUTE), icon: "📊" },
        { label: t.nav.profile, href: LANGUAGE_ROUTE(lang, PROFILE_ROUTE), icon: "👤" }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <div className="w-full flex flex-row justify-between my-2">
                {/* Left (main) - Hidden on mobile */}
                <div className="hidden md:flex flex-row gap-6">
                    {mainNavItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="group relative flex items-center gap-1 text-sm font-medium text-foreground-muted hover:text-foreground tracking-tight"
                        >
                            <span className="text-sm opacity-80 group-hover:opacity-80 transition-opacity">
                                {item.icon}
                            </span>
                            {item.label}

                            {/* Active/hover indicator */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />                        
                        </Link>
                    ))}
                </div>

                {/* Right (secondary) - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-3">
                    {subNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative rounded-md text-xs font-medium text-foreground/50 hover:text-foreground/80 transition-all duration-200 hover:bg-background-secondary/30 tracking-tight"
                        >
                            {item.label}
                            
                            {/* Active/hover indicator */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-4/5 transition-all duration-300 ease-out" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Navigation Button - Bottom Right Corner */}
            <div className={`fixed md:hidden bottom-6 right-6 z-[100] ${isInGame && 'hidden'}`}>
                <button
                    onClick={toggleMobileMenu}
                    className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
                        isMobileMenuOpen 
                            ? 'bg-secondary text-background scale-105' 
                            : 'bg-primary text-background'
                    }`}
                    aria-label="Toggle navigation menu"
                >
                    <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}>
                        {isMobileMenuOpen ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </div>
                </button>
            </div>

            {/* Mobile Menu - Full Screen Slide Up */}
            <div className={`md:hidden fixed inset-0 z-50 transition-transform duration-500 ease-out ${
                isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}>
                {/* Menu Background */}
                <div className="absolute inset-0 bg-background" />
                
                {/* Menu Content */}
                <div className="relative h-full flex flex-col">
                    {/* Close Button */}
                    <div className="flex justify-end p-6">
                        <button
                            onClick={closeMobileMenu}
                            className="w-10 h-10 rounded-full bg-background-secondary flex items-center justify-center text-foreground-muted transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Navigation Content */}
                    <div className="flex-1 px-6 pb-8">
                        {/* Main Navigation */}
                        <div className="mb-12">
                            <div className="grid gap-3">
                                {mainNavItems.map((item, index) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group animate-in slide-in-from-bottom-3 ${
                                            `animation-delay-${index * 50}`
                                        }`}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-lg transition-colors">
                                            {item.icon}
                                        </div>
                                        <span className="text-lg font-medium text-foreground">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-background-secondary mb-8" />

                        {/* Secondary Navigation */}
                        <div>
                            <div className="grid gap-2">
                                {subNavItems.map((item, index) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group animate-in slide-in-from-bottom-2 ${
                                            `animation-delay-${(mainNavItems.length + index) * 50 + 100}`
                                        }`}
                                        style={{ animationDelay: `${(mainNavItems.length + index) * 50 + 100}ms` }}
                                    >
                                        <span className="text-base opacity-70">{item.icon}</span>
                                        <span className="text-base font-medium text-foreground">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}