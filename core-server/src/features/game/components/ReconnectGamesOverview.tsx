"use client"

import { useEffect, useState } from "react"
import { ActiveGameTeaserModel } from "../game-models"
import GetActiveGamesForCurrentPlayerRequest from "../actions/query/get-active-games-for-current-player";
import GameTeaserCard from "./GameTeaserCard";
import { useAuth } from "@/features/auth/AuthContext";
import { SupportedLanguage } from "@/features/i18n/languages";
import LoadingDots from "@/components/ui/animation/LoadingDots";

interface Props {
    lang: SupportedLanguage;
}

export default function ReconnectGamesOverview({lang}:Props) {
    const {account} = useAuth();
    const [games, setGames] = useState<ActiveGameTeaserModel[] | null>(null);

    useEffect(() => {
        if (!account) return;

        async function fetchGames() {
            const response = await GetActiveGamesForCurrentPlayerRequest();
            setGames(response);
        }

        fetchGames();
    }, [account]);

    if (!account) {
        return <div></div>
    }

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            {games ? (
                games.length == 0 ? (
                    <span>No active games at the moment...</span>
                ) : (
                    <div className="w-full flex flex-col gap-2">
                        {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} lang={lang} />)}
                    </div>                        
                )
            ) : (
                <><LoadingDots /></>
            )}            
        </div>
    )
}