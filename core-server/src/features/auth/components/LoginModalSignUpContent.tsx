import { CardContent } from "@/components/ui/card/card-children";
import { LogIn, Users } from "lucide-react";
import SignUpForm from "./form/SignUpForm";
import Button from "@/components/ui/Button";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import { SupportedLanguage } from "@/features/i18n/languages";
import { useAuth } from "../AuthContext";
import { LoginModalState } from "./LoginModal";

interface Props {
    t: GeneralTranslations;
    defaultLanguage: SupportedLanguage;
}

export default function LoginModalSignUpContent({ t, defaultLanguage }: Props) {
    const { setLoginModalState } = useAuth();

    return (
        <>
        <DefaultCardHeader
            Icon={Users}
            title={t.login.signUp.title}
            description={t.login.signUp.description}
        />        

        <CardContent>
            <SignUpForm t={t} defaultLanguage={defaultLanguage} />
            <Button variant="skeleton" className="w-full" onClick={() => setLoginModalState(LoginModalState.Login)}>
                <LogIn className="w-4 h-4" />
                {t.login.login.backToLoginButton}
            </Button>                
        </CardContent>
        </>
    )
}