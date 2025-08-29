"use client"

import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE } from "@/app/routes";
import CopyTextBlock from "@/components/ui/CopyTextBlock";
import { SupportedLanguage } from "@/features/i18n/languages";
import { useEffect, useState } from "react";

export default function LobbyJoinLink({ joinCode, lang, label }: { joinCode: string, lang: SupportedLanguage, label: string }) {
    const [joinLink, setJoinLink] = useState("");

    useEffect(() => {
        setJoinLink(`${window.location.origin}${LANGUAGE_ROUTE(lang, JOIN_GAME_ROUTE(joinCode))}`);
    }, []);
    
    return (
        <CopyTextBlock label={label} value={joinLink} />
    )
}