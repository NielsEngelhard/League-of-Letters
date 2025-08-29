import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { HatGlasses, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import LoginForm from "../LoginForm";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    onShowSignUp: () => void;
    onShowContinueAsGuest: () => void;
    t: GeneralTranslations;
}

export default function LoginModalLoginContent({ onShowSignUp, onShowContinueAsGuest, t }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={LogIn}
            title={t.login.login.title}
            description={t.login.login.description}
        />

        <CardContent>
            <LoginForm onNavToSignUp={onShowSignUp} />
      
            <div>
                <Button variant="skeleton" className="w-full mt-4" onClick={onShowContinueAsGuest}>
                    <HatGlasses className="w-4 h-4" />
                    {t.login.login.guestButton}
                </Button>         
                <span className="text-xs font-medium text-foreground-muted">
                    {t.login.guest.guestDisclaimer}
                </span>            
            </div>                 
        </CardContent>
        </>
    )
}