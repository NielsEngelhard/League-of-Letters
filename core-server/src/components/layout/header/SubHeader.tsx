"use client";

import { ACCOUNT_SETTINGS_ROUTE, CREATE_MULTIPLAYER_GAME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PROFILE_ROUTE, RECONNECT_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import Link from "next/link";
import { useState } from "react";

interface Props {
    t: GeneralTranslations;
    lang: SupportedLanguage;
}

export default function SubHeader({t, lang}: Props) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <div className="fixed md:hidden bottom-4 right-4 z-[1000]">
                <button
                    onClick={toggleMobileMenu}
                    className="w-14 h-14 bg-gradient-to-bl from-primary to-secondary text-background rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
                    aria-label="Toggle navigation menu"
                >
                    <div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : ''}`}>
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </div>
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
                        onClick={closeMobileMenu}
                    />
                    
                    {/* Menu Panel */}
                    <div className="md:hidden fixed inset-x-4 bottom-24 z-50 bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                        <div className="p-6">
                            {/* Main Navigation Section */}
                            <div className="mb-6">
                                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3">
                                    Game Modes
                                </h3>
                                <div className="space-y-1">
                                    {mainNavItems.map((item) => (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-secondary/50 transition-colors group"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="text-sm font-medium text-foreground group-hover:text-primary">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Secondary Navigation Section */}
                            <div>
                                <h3 className="text-xs font-semibold text-foreground/60 uppercase tracking-wider mb-3 z-50">
                                    Account
                                </h3>
                                <div className="space-y-1">
                                    {subNavItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-background-secondary/50 transition-colors group"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="text-sm font-medium text-foreground group-hover:text-primary">
                                                {item.label}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}