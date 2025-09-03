import { CardContent } from "@/components/ui/card/card-children";
import { HatGlasses, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import GuestLoginForm from "../GuestLoginForm";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";

interface Props {
    onBackToLogin: () => void;
    t: GeneralTranslations;
    lang: SupportedLanguage;
}

export default function LoginModalContinueAsGuestContent({ onBackToLogin, t, lang }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={HatGlasses}
            title={t.login.guest.title}
            description={t.login.guest.description}>
        </DefaultCardHeader>

        <CardContent>
            <GuestLoginForm lang={lang} t={t} />
            <Button variant="skeleton" className="w-full" onClick={onBackToLogin}>
                <LogIn className="w-4 h-4" />
                {t.login.login.backToLoginButton}
            </Button>                
        </CardContent>
        </>
    )
}