"use client"

import { ArrowRight } from "lucide-react"
import Button from "../ui/Button"
import { useAuth } from "@/features/auth/AuthContext";

interface Props {
  btnText: string;
}

export default function GoBackButton({btnText}: Props) {
    const { setShowLoginModal } = useAuth();

    return (
      <Button onClick={() => setShowLoginModal(true)} size="lg">
        {btnText}
        <ArrowRight className="w-4 h-4" />
      </Button>        
    )
}