import { CardContent } from "@/components/ui/card/card-children";
import { LogIn, Users } from "lucide-react";
import SignUpForm from "../SignUpForm";
import Button from "@/components/ui/Button";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    onBackToLogin: () => void;
    t: GeneralTranslations;
}

export default function LoginModalSignUpContent({ onBackToLogin, t }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={Users}
            title={t.login.signUp.title}
            description={t.login.signUp.description}
        />        

        <CardContent>
            <SignUpForm />
            <Button variant="skeleton" className="w-full" onClick={onBackToLogin}>
                <LogIn className="w-4 h-4" />
                {t.login.login.backToLoginButton}
            </Button>                
        </CardContent>
        </>
    )
}