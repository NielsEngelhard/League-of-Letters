import { ACCOUNT_SETTINGS_ROUTE, CREATE_MULTIPLAYER_GAME_ROUTE, JOIN_GAME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, PROFILE_ROUTE, PROFILE_SETTINGS_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import Link from "next/link";

interface Props {
    t: GeneralTranslations;
    lang: SupportedLanguage;
}

export default function SubHeader({t, lang}: Props) {
    const mainNavItems = [
        { label: t.nav.soloGame, href: LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE), icon: "🎯" },
        { label: t.nav.onlineGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🌐" },
        { label: t.nav.createGame, href: LANGUAGE_ROUTE(lang, CREATE_MULTIPLAYER_GAME_ROUTE), icon: "➕" },
        { label: t.nav.joinGame, href: LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE), icon: "🔗" }
    ];

    const subNavItems = [
        { label: t.nav.settings, href: LANGUAGE_ROUTE(lang, ACCOUNT_SETTINGS_ROUTE)},
        { label: t.nav.scoreSystem, href: LANGUAGE_ROUTE(lang, SCORE_ROUTE) },
        { label: t.nav.profile, href: LANGUAGE_ROUTE(lang, PROFILE_ROUTE) }
    ];

    return (
        <div className="w-full flex flex-row justify-between my-2">
            {/* Left (main) */}
            <div className="flex flex-row gap-6">
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

            {/* Right (secondary) */}
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
    )
}