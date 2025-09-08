import { CardContent } from "@/components/ui/card/card-children";
import { HatGlasses, LogIn, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import LoginForm from "./form/LoginForm";
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

            <CardContent className="space-y-6">
                <LoginForm t={t} />
                
                <div className="">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
                        <Button 
                            variant="skeleton" 
                            className="w-full flex items-center justify-center gap-2" 
                            onClick={onShowContinueAsGuest}
                        >
                            <HatGlasses className="w-4 h-4" />
                            {t.login.login.guestButton}
                        </Button>
                        
                        <Button 
                            variant="secondary" 
                            className="w-full flex items-center justify-center gap-2" 
                            onClick={onShowSignUp}
                        >
                            <UserPlus className="w-4 h-4" />
                            {t.login.login.signUpButton}
                        </Button>                      
                    </div>
                    <div className="text-center">
                        <span className="text-xs text-foreground-muted font-bold">
                            {t.login.guest.guestDisclaimer}
                        </span>  
                    </div>                    
                </div>
            </CardContent>
        </>
    )
}