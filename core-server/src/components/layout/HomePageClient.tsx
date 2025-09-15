"use client"

import { useEffect } from "react"
import FullScreenLoading from "../ui/animation/FullScreenLoading"
import { DefaultLanguage, SupportedLanguage } from "@/features/i18n/languages";
import { useRouter } from "next/navigation";
import { HOME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";

export default function HomePageClient() {
    const router = useRouter();
    
    useEffect(() => {
        const browserLanguage = getBrowserLanguageOrDefault();
        router.push(LANGUAGE_ROUTE(browserLanguage, HOME_ROUTE));
    }, []);

    function getBrowserLanguageOrDefault(): SupportedLanguage {
        try {
            const lang = navigator.language || (navigator.languages && navigator.languages[0]) || DefaultLanguage;
            return lang.split("-")[0] as SupportedLanguage;            
        } catch {
            return DefaultLanguage;
        }
    }    
    
    return (
        <FullScreenLoading />
    )
}