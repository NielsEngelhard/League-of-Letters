import { HOME_ROUTE, LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import Link from "next/link";
import WebSocketStatusIndicator from "../WebSocketStatusIndicator";
import LoginModal from "@/features/account/components/login-modal/LoginModal";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import Image from "next/image";
import HeaderUserClient from "./HeaderUserClient";
import { GetCurrentUser_Server } from "@/features/auth/current-user";

export default async function Header({ lang } : {lang: SupportedLanguage }) {
    const t = await loadTranslations(lang, ["general"]);
    
    const currentUser = await GetCurrentUser_Server();
    console.log(currentUser);

    return (
        <header className="w-full h-16 fixed top-0 z-50 bg-background-secondary/80 backdrop-blur-xl border-b border-border/20 shadow-sm">
            <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-full">
                {/* Left - Logo & Status */}
                <div className="flex items-center gap-4">
                    <Link 
                        href={currentUser ? LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE) : LANGUAGE_ROUTE(lang, HOME_ROUTE)}
                        className="group flex items-center transition-all duration-200"
                    >
                        <div className="relative">
                                <Image
                                    src="/logo.png"
                                    className="object-contain transition-all duration-200 group-hover:brightness-110"
                                    alt="Logo"
                                    width={70}
                                    height={30}
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
                <HeaderUserClient t={t.general} lang={lang} />
            </div>
            
            <LoginModal t={t.general} lang={lang} />
        </header>
    )
}