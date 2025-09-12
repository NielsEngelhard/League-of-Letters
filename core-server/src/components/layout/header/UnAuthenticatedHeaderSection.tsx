"use client"

import Button from "@/components/ui/Button"
import { useAuth } from "@/features/auth/AuthContext"
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations"
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import { HatGlasses, Play } from "lucide-react";
import { LoginModalState } from "@/features/auth/components/LoginModal";
import { SupportedLanguage } from "@/features/i18n/languages";
import HeaderThemePicker from "./HeaderThemePicker";

export default function UnauthenticatedHeaderSection({ t, lang }: { t: GeneralTranslations, lang: SupportedLanguage }) {
    const { setLoginModalState } = useAuth();

    return (
        <div className="flex items-center gap-3 py-2">
            <HeaderThemePicker />

            <HeaderLanguagePicker currentLanguage={lang} />
            
            <Button
                variant="primary" 
                size="sm" 
                onClick={() => setLoginModalState(LoginModalState.Login)}
                className="px-6 py-2.5 font-semibold transition-all duration-300 hover:scale-105"
            >
                <Play className="w-4 h-4" />
                <span className="items-center gap-2 hidden md:flex">
                    {t.startButton}
                </span>
            </Button>

            <Button
                variant="skeleton" 
                size="sm" 
                onClick={() => setLoginModalState(LoginModalState.ContinueAsGuest)}
                className="px-6 py-2.5 font-semibold transition-all duration-300 hover:scale-105"
            >
                <HatGlasses className="w-4 h-4" />
                <span className="items-center gap-2 hidden md:flex">
                    {t.login.login.guestButton}
                </span>
            </Button>            
        </div>        
    )
}