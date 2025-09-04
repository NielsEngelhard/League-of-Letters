"use client"

import { ArrowRight } from "lucide-react"
import Button from "../ui/Button"
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect } from "react";

interface Props {
  btnText: string;
}

export default function GoBackButton({btnText}: Props) {
    const { setShowLoginModal } = useAuth();

    useEffect(() => {
      setShowLoginModal(true);
    }, []);

    return (
      <Button onClick={() => setShowLoginModal(true)} size="lg">
        {btnText}
        <ArrowRight className="w-4 h-4" />
      </Button>        
    )
}