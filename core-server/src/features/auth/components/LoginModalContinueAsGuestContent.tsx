import { CardContent } from "@/components/ui/card/card-children";
import { HatGlasses, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import GuestLoginForm from "./form/GuestLoginForm";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";
import { useAuth } from "../AuthContext";
import { LoginModalState } from "./LoginModal";

interface Props {
    t: GeneralTranslations;
    lang: SupportedLanguage;
}

export default function LoginModalContinueAsGuestContent({ t, lang }: Props) {
    const { setLoginModalState } = useAuth();

    return (
        <>
        <DefaultCardHeader
            Icon={HatGlasses}
            title={t.login.guest.title}
            description={t.login.guest.guestDisclaimer}>
        </DefaultCardHeader>

        <CardContent>
            <GuestLoginForm lang={lang} t={t} />
            <Button variant="skeleton" className="w-full" onClick={() => setLoginModalState(LoginModalState.Login)}>
                <LogIn className="w-4 h-4" />
                {t.login.login.backToLoginButton}
            </Button>                
        </CardContent>
        </>
    )
}