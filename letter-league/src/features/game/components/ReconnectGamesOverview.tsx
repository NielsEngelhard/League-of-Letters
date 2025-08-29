"use client"

import { useEffect, useState } from "react"
import { ActiveGameTeaserModel } from "../game-models"
import GetActiveGamesForCurrentPlayerRequest from "../actions/query/get-active-games-for-current-player";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import GameTeaserCard from "./GameTeaserCard";
import UspCard from "@/components/ui/UspCard";
import { Gamepad } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { SupportedLanguage } from "@/features/i18n/languages";

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
        <div className="w-full flex flex-col gap-2 items-center">
 
            <UspCard Icon={Gamepad} title="Current Games" fullWidth={true}>
                {games ? (
                    games.length == 0 ? (
                        <span>No active games at the moment</span>
                    ) : (
                        <div className="w-full flex flex-col gap-2">
                            {games.map((teaser, i) => <GameTeaserCard key={i} teaser={teaser} lang={lang} />)}
                        </div>                        
                    )
                ) : (
                    <><LoadingSpinner /></>
                )}
            </UspCard>
        </div>
    )
}