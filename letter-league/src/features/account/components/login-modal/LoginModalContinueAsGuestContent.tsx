import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { LogIn, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import GuestLoginForm from "../GuestLoginForm";

interface Props {
    onBackToLogin: () => void;
}

export default function LoginModalContinueAsGuestContent({ onBackToLogin }: Props) {
    return (
        <>
        <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Users className="w-4 h-4" />
                Continue as guest
            </CardTitle>
            <SubText text="Create a temporary guest account" /> 
        </CardHeader>

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