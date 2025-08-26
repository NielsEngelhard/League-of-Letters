import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { HatGlasses, LogIn, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import GuestLoginForm from "../GuestLoginForm";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";

interface Props {
    onBackToLogin: () => void;
}

export default function LoginModalContinueAsGuestContent({ onBackToLogin }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={HatGlasses}
            title="Continue as Guest"
            description="Jump in quickly with a temporary account">
        </DefaultCardHeader>

        <CardContent>
            <GuestLoginForm />
            <Button variant="skeleton" className="w-full" onClick={onBackToLogin}>
                <LogIn className="w-4 h-4" />
                back to Login
            </Button>                
        </CardContent>
        </>
    )
}