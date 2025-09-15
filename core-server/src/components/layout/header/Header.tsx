"use server"

import { HOME_ROUTE, LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import Image from "next/image";
import HeaderAccountInfo from "./HeaderAccountInfo";
import { Authenticate_Server } from "@/features/auth/current-user";
import LoginModal from "@/features/auth/components/LoginModal";
import SubHeader from "./SubHeader";

export default async function Header({ lang } : {lang: SupportedLanguage }) {
    const t = await loadTranslations(lang, ["general"]);
    
    const currentUser = await Authenticate_Server();

    return (
        <header className="flex flex-col z-50 w-full">

            {/* Main header */}
            <div className="w-full bg-background-secondary border-b border-border/20 shadow-sm">
                <div className="flex items-center justify-between max-w-6xl mx-auto px-6 h-full">
                    {/* Left - Logo & Status */}
                    <Link
                        href={currentUser ? LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE) : LANGUAGE_ROUTE(lang, HOME_ROUTE)}
                        className="group flex items-center w-fit px-2 h-full"
                    >
                        <Image
                            src="/logo.png"
                            className="object-contain transition-all duration-300 ease-out group-hover:brightness-110"
                            alt="Logo"
                            width={60}
                            height={30}
                        />
                    </Link>                 

                    {/* Right - User Section */}
                    <HeaderAccountInfo t={t.general} lang={lang} account={currentUser} />
                </div>
                
                
            </div>

            {/* Sub header nav menu */}
            {currentUser && (
                <div className="justify-center">
                    <div className="max-w-6xl px-6 w-full">
                        <SubHeader t={t.general} lang={lang} />
                    </div>
                </div>                
            )}

            <LoginModal t={t.general} lang={lang} />
        </header>

    )
}