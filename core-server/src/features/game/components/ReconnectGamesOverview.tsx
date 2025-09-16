"use client"

import { useEffect, useState } from "react"
import { ActiveGameTeaserModel } from "../game-models"
import GetActiveGamesForCurrentPlayerRequest from "../actions/query/get-active-games-for-current-player";
import GameTeaserCard from "./GameTeaserCard";
import { useAuth } from "@/features/auth/AuthContext";
import { SupportedLanguage } from "@/features/i18n/languages";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";

interface Props {
    lang: SupportedLanguage;
    t: GeneralTranslations;
}

export default function ReconnectGamesOverview({lang,t}:Props) {
    const {account} = useAuth();
    const [games, setGames] = useState<ActiveGameTeaserModel[] | null>(null);

    useEffect(() => {
        if (!account) return;

        async function fetchGames() {
            const response = await GetActiveGamesForCurrentPlayerRequest();
            
            // Sort games by creation date (newest first)
            const sortedGames = response.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB.getTime() - dateA.getTime();
            });
            
            setGames(sortedGames);
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
                    <span>{t.reconnect.noGamesFound}</span>
                ) : (
                    <div className="w-full flex flex-col gap-2">
                        {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} lang={lang} currentPlayerAccountId={account.id} />)}
                    </div>
                                        
                )
            ) : (
                <><LoadingDots /></>
            )}
                    
        </div>
    )
}