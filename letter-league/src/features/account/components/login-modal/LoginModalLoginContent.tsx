import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { HatGlasses, LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import LoginForm from "../LoginForm";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";

interface Props {
    onShowSignUp: () => void;
    onShowContinueAsGuest: () => void;
}

export default function LoginModalLoginContent({ onShowSignUp, onShowContinueAsGuest }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={LogIn}
            title="Login to proceed."
            description="You can also continue as a guest and create a temporarily session."
        />

        <CardContent>
            <LoginForm onNavToSignUp={onShowSignUp} />
      
            <div>
                <Button variant="skeleton" className="w-full mt-4" onClick={onShowContinueAsGuest}>
                    <HatGlasses className="w-4 h-4" />
                    Continue as Guest
                </Button>         
                <span className="text-xs font-medium text-foreground-muted">
                    24-hour guest session. Progress won’t be saved, and reconnecting will be limited.    
                </span>            
            </div>                 
        </CardContent>
        </>
    )
}