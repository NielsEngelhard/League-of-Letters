"use client"

import { ArrowRight } from "lucide-react"
import Button from "../ui/Button"
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react";
import { LoginModalState } from "@/features/auth/components/LoginModal";

interface Props {
  btnText: string;
}

export default function GoBackButton({btnText}: Props) {
    const { setLoginModalState } = useAuth();

    useEffect(() => {
      setLoginModalState(LoginModalState.Login);
    }, []);

    return (
      <Button onClick={() => setLoginModalState(LoginModalState.Login)} size="lg">
        {btnText}
        <ArrowRight className="w-4 h-4" />
      </Button>        
    )
}