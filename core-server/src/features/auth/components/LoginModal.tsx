"use client"

import Card from "@/components/ui/card/Card";
import { CircleX } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";
import LoginModalLoginContent from "./LoginModalLoginContent";
import LoginModalSignUpContent from "./LoginModalSignUpContent";
import LoginModalContinueAsGuestContent from "./LoginModalContinueAsGuestContent";

interface Props {
    lang: SupportedLanguage;
    t: GeneralTranslations;
}

export enum LoginModalState {
    Hidden,
    Login,
    Signup,
    ContinueAsGuest
}

export default function LoginModal({ t, lang }: Props) {
    const { loginModalState, setLoginModalState } = useAuth();

    if (loginModalState == LoginModalState.Hidden) {
        return;
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center">
            <Card className="w-full mx-2 max-w-[500px] shadow-2xl relative" includeSpacing={true}>
                {loginModalState == LoginModalState.Login && (
                    <LoginModalLoginContent t={t} />
                )}

                {loginModalState == LoginModalState.Signup && (
                    <LoginModalSignUpContent t={t} defaultLanguage={lang} />
                )}

                {loginModalState == LoginModalState.ContinueAsGuest && (
                    <LoginModalContinueAsGuestContent t={t} lang={lang} />
                )}                                

                <div className="absolute right-2 top-2">
                    <button onClick={() => setLoginModalState(LoginModalState.Hidden)} className="hover:cursor-pointer">
                        <CircleX className="text-foreground-muted" />
                    </button>
                </div>                
            </Card>
        </div>
    )
}