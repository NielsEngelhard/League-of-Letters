import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { HatGlasses, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import LoginForm from "../LoginForm";

interface Props {
    onShowSignUp: () => void;
    onShowContinueAsGuest: () => void;
}

export default function LoginModalLoginContent({ onShowSignUp, onShowContinueAsGuest }: Props) {
    return (
        <>
        <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Login
            </CardTitle>
            <SubText text="Login to proceed. You can also continue as a guest and create a temporarily session." /> 
        </CardHeader>

        <CardContent>
            <LoginForm onNavToSignUp={onShowSignUp} />
      
            <div>
                <Button variant="skeleton" className="w-full mt-4" onClick={onShowContinueAsGuest}>
                    <HatGlasses className="w-4 h-4" />
                    Continue as Guest
                </Button>         
                <span className="text-sm font-medium text-foreground-muted">
                    24-hour guest session. Progress won’t be saved, and reconnecting will be limited.    
                </span>            
            </div>                 
        </CardContent>
        </>
    )
}