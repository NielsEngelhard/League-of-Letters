"use client"

import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages"
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

interface Props {
    userIsAuthenticated: boolean;
    lang: SupportedLanguage;    
    label: string;
}

export default function PlayNowCtaButton({ userIsAuthenticated, lang, label }: Props) {
    const router = useRouter();  
    
    function onPlayNow() {
        if (userIsAuthenticated) {
            router.push(LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE));
        } else {
            router.push(LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE));
        }
      }

    return (
        <Button variant="primaryFade" size="lg" onClick={onPlayNow}>
            <span className="">
                {label}
            </span>
        </Button>   
    )
}