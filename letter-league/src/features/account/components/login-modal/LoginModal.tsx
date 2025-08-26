import Card from "@/components/ui/card/Card";
import { CircleX } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from "next/navigation";
import LoginModalLoginContent from "./LoginModalLoginContent";
import LoginModalContinueAsGuestContent from "./LoginModalContinueAsGuestContent";
import LoginModalSignUpContent from "./LoginModalSignUpContent";

interface Props {

}

enum LoginModalState {
    Login,
    Signup,
    ContinueAsGuest
}

export default function LoginModal({}: Props) {


    const [modalState, setModalState] = useState(LoginModalState.Login);
    const { setShowLoginModal, loginWithGuestAccount } = useAuth();
    const router = useRouter();

    async function onContinueAsGuest () {
        // await loginWithGuestAccount();
        // router.push(PICK_GAME_MODE_ROUTE);
    }

    return (
        <div className="fixed top-0 left-0 w-screen h-screen bg-background-secondary/80 flex items-center justify-center">
            <Card className="w-full mx-2 max-w-[500px] shadow-2xl relative">
                {modalState == LoginModalState.Login && (
                    <LoginModalLoginContent
                        onShowContinueAsGuest={() => setModalState(LoginModalState.ContinueAsGuest)}
                        onShowSignUp={() => setModalState(LoginModalState.Signup)}
                    />
                )}

                {modalState == LoginModalState.Signup && (
                    <LoginModalSignUpContent onBackToLogin={() => setModalState(LoginModalState.Login)} />
                )}

                {modalState == LoginModalState.ContinueAsGuest && (
                    <LoginModalContinueAsGuestContent onBackToLogin={() => setModalState(LoginModalState.Login)} />
                )}                                

                <div className="absolute right-2 top-2">
                    <button onClick={() => setShowLoginModal(false)} className="hover:cursor-pointer">
                        <CircleX className="text-foreground-muted" />
                    </button>
                </div>                
            </Card>
        </div>
    )
}