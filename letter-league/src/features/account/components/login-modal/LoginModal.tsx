"use client"

import Card from "@/components/ui/card/Card";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import LoginModalLoginContent from "./LoginModalLoginContent";
import LoginModalContinueAsGuestContent from "./LoginModalContinueAsGuestContent";
import LoginModalSignUpContent from "./LoginModalSignUpContent";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";

interface Props {
    lang: SupportedLanguage;
    t: GeneralTranslations;
}

enum LoginModalState {
    Login,
    Signup,
    ContinueAsGuest
}

export default function LoginModal({ t }: Props) {
    const [modalState, setModalState] = useState(LoginModalState.Login);
    const { setShowLoginModal, showLoginModal } = useAuth();

    if (!showLoginModal) {
        return;
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center">
            <Card className="w-full mx-2 max-w-[500px] shadow-2xl relative" includeSpacing={true}>
                {modalState == LoginModalState.Login && (
                    <LoginModalLoginContent
                        t={t}
                        onShowContinueAsGuest={() => setModalState(LoginModalState.ContinueAsGuest)}
                        onShowSignUp={() => setModalState(LoginModalState.Signup)}
                    />
                )}

                {modalState == LoginModalState.Signup && (
                    <LoginModalSignUpContent onBackToLogin={() => setModalState(LoginModalState.Login)} t={t} />
                )}

                {modalState == LoginModalState.ContinueAsGuest && (
                    <LoginModalContinueAsGuestContent onBackToLogin={() => setModalState(LoginModalState.Login)} t={t} lang={lang} />
                )}                                

                <div className="absolute right-2 top-2">
                    <button onClick={() => setShowLoginModal(false)} className="hover:cursor-pointer">
                        <CircleX className="text-foreground-muted" />
                    </button>
                </div>                
            </Card>
        </div>
    )
}