import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import SubText from "@/components/ui/text/SubText";
import { LogIn } from "lucide-react";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

interface Props {

}

export default function LoginModal({}: Props) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center">
            <Card className="w-full mx-2 max-w-[500px]">
                <CardHeader>
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        {showLogin ? "Login" : "Sign Up"}
                    </CardTitle>
                    <SubText text={showLogin ? 
                        "Login to proceed. You can also continue with a Guest account" : 
                        "Create an account for free."} /> 
                </CardHeader>
                <CardContent>          
                    {showLogin ? (
                        <>
                            <LoginForm></LoginForm>
                            <Button variant="secondary" className="w-full" onClick={() => setShowLogin(false)}>
                                Or Sign Up for free!
                            </Button>
                        </>
                    ) : (
                        <>
                            <SignUpForm></SignUpForm>
                            <Button variant="skeleton" className="w-full" onClick={() => setShowLogin(true)}>
                                back to Login
                            </Button>                            
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}