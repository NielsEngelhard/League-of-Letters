"use client"

import Button from "@/components/ui/Button"
import { useAuth } from "@/features/auth/AuthContext"
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations"
import HeaderLanguagePicker from "./HeaderLanguagePicker";

export default function UnauthenticatedHeaderSection({ t }: { t: GeneralTranslations }) {
    const { setShowLoginModal } = useAuth();

    return (
        <div className="flex items-center gap-3">
            <HeaderLanguagePicker />
            
            <Button
                variant="primary" 
                size="sm" 
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2.5 font-semibold transition-all duration-300 hover:scale-105"
            >
                <span className="flex items-center gap-2">
                    {t.startButton}
                </span>
            </Button>
        </div>        
    )
}