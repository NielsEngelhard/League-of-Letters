"use client"

import { useEffect } from "react";
import { ActiveGameModel } from "../game-models";
import { useActiveGame } from "./active-game-context";
import GameBoard from "./GameBoard";
import GameResultOverview from "./GameResultOverview";
import { useAuth } from "@/features/auth/AuthContext";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { SupportedLanguage } from "@/features/i18n/languages";

interface Props {
    initialGameState: ActiveGameModel;
    lang: SupportedLanguage;
}

export default function IngameClient({ initialGameState, lang }: Props) {
    const { initializeGameState, game, clearGameState, players } = useActiveGame();        
    const { account } = useAuth();

    useEffect(() => {
        if (!account) return;

        initializeGameState(initialGameState, account.id);
    }, [account]);

    if (!game) {
        return <LoadingSpinner size="lg" center={true} />;
    }

    return (
        <>
            {game?.gameIsOver ? (
                <GameResultOverview
                    lang={lang}
                    players={players}
                />
            ) : (
                <GameBoard />
            )}
        </>
    )
}