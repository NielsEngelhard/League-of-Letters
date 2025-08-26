import { CardContent } from "@/components/ui/card/card-children";
import { LogIn, Users } from "lucide-react";
import SignUpForm from "../SignUpForm";
import Button from "@/components/ui/Button";
import DefaultCardHeader from "@/components/ui/card/DefaultCardHeader";

interface Props {
    onBackToLogin: () => void;
}

export default function LoginModalSignUpContent({ onBackToLogin }: Props) {
    return (
        <>
        <DefaultCardHeader
            Icon={Users}
            title="Sign up"
            description="Join the club and create an account for free!"
        />        

        <CardContent>
            <SignUpForm />
            <Button variant="skeleton" className="w-full" onClick={onBackToLogin}>
                <LogIn className="w-4 h-4" />
                back to Login
            </Button>                
        </CardContent>
        </>
    )
}