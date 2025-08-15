import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { CircleX, ClosedCaption, Cross, HatGlasses, LogIn } from "lucide-react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {

}

export default function LoginModal({}: Props) {
    const [onLoginSection, setOnLoginSection] = useState(true);
    const { toggleLoginModal } = useAuth();

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center">
            <Card className="w-full mx-2 max-w-[500px] shadow-2xl relative">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        {onLoginSection ? "Login" : "Sign Up"}
                    </CardTitle>
                    <SubText text={onLoginSection ? 
                        "Login to proceed. You can also continue with a Guest account" : 
                        "Create an account for free."} /> 
                </CardHeader>
                <CardContent>           
                    {onLoginSection ? (
                        <>
                            <LoginForm onNavToSignUp={() => setOnLoginSection(false)}></LoginForm>
                        </>
                    ) : (
                        <>
                            <SignUpForm></SignUpForm>
                            <Button variant="skeleton" className="w-full" onClick={() => setOnLoginSection(true)}>
                                <LogIn className="w-4 h-4" />
                                back to Login
                            </Button>                            
                        </>
                    )}

                    <Button variant="skeleton" className="w-full mt-4">
                        <HatGlasses className="w-4 h-4" />
                        Continue as Guest
                    </Button>                        
                </CardContent>

                <div className="absolute right-2 top-2">
                    <button onClick={toggleLoginModal} className="hover:cursor-pointer">
                        <CircleX className="text-foreground-muted" />
                    </button>
                </div>
            </Card>
        </div>
    )
}