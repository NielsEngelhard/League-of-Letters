"use client"

import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { Link } from "lucide-react";
import { useEffect, useState } from "react";

export default function LobbyJoinLink({ 
    joinCode, 
    lang, 
}: { 
    joinCode: string, 
    lang: SupportedLanguage, 
    label: string 
}) {
    const [joinLink, setJoinLink] = useState("");

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setJoinLink(`${window.location.origin}${LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode))}`);
        }
    }, [lang, joinCode]);

    if (!joinLink) {
        return (
            <div className="w-full animate-pulse">
                <div className="h-4 bg-[var(--color-border)] rounded w-20 mb-2" />
                <div className="h-14 bg-[var(--color-border)] rounded-xl" />
            </div>
        );
    }

    return (
        <span className="underline flex flex-row items-center gap-0.5 truncate">
            <Link size={16} />
            {joinLink}adsadsads  asdsad sad asd asdsaasd
        </span>        
    )
}