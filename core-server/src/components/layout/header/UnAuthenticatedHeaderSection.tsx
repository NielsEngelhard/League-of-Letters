"use client"

import Button from "@/components/ui/Button"
import { useAuth } from "@/features/auth/AuthContext"
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations"
import HeaderLanguagePicker from "./HeaderLanguagePicker";
import { HatGlasses, Play } from "lucide-react";
import { LoginModalState } from "@/features/auth/components/LoginModal";

export default function UnauthenticatedHeaderSection({ t }: { t: GeneralTranslations }) {
    const { setLoginModalState } = useAuth();

    return (
        <div className="flex items-center gap-3">
            <HeaderLanguagePicker />
            
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