"use client"

import { useEffect } from "react";
import { ActiveGameModel } from "../game-models";
import { useActiveGame } from "./active-game-context";
import GameBoard from "./in-game/GameBoard";
import GameResultOverview from "./GameResultOverview";
import { useAuth } from "@/features/auth/AuthContext";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { SupportedLanguage } from "@/features/i18n/languages";
import { useSocket } from "@/features/realtime/socket-context";
import { GeneralTranslations } from "@/features/i18n/translation-file-interfaces/GeneralTranslations";
import InGameTranslations from "@/features/i18n/translation-file-interfaces/InGameTranslations";
import { SettingsTranslations } from "@/features/i18n/translation-file-interfaces/SettingsTranslations";
import ScoreTranslations from "@/features/i18n/translation-file-interfaces/ScoreTranslations";
import { GameTimeOffsetTracker } from "../util/algorithm/time-offset/game-time-offset-tracker";
import { GetCurrentRoundIndexInArray } from "../active-game-util";

interface Props {
    initialGameState: ActiveGameModel;
    lang: SupportedLanguage;
    generalTranslations: GeneralTranslations;
    inGameTranslations: InGameTranslations;
    settingsTranslations: SettingsTranslations;
    scoreTranslations: ScoreTranslations;
}

export default function IngameClient({ initialGameState, lang, generalTranslations, inGameTranslations, settingsTranslations, scoreTranslations }: Props) {
    const { initializeGameState, game, clearGameState, players } = useActiveGame();    
    const { emitJoinGame, connectionStatus } = useSocket(); 
    const { account } = useAuth();

    // On client leave, clean game state
    useEffect(() => {
        return () => {
            clearGameState();
        }
    }, []);    

    // Initialize game
    useEffect(() => {
        if (!account) return;
        applyTimeOffset(initialGameState);
        initializeGameState(initialGameState, account.id);
    }, [account]);

    function applyTimeOffset(game: ActiveGameModel) {
        const offset = GameTimeOffsetTracker.calculateForGame(game);
        if (offset == null) return;

        game.currentRoundIndex = offset.actualRound;
        
        const currentRoundArrayIndex = GetCurrentRoundIndexInArray(game);
        game.rounds[currentRoundArrayIndex].currentGuessIndex = offset.actualGuess;
    }

    // Join the game room when realtime is connected
    useEffect(() => {
        if (!account || connectionStatus != "connected") return;

        emitJoinGame({
            gameId: initialGameState.id,
            accountId: account.id,
            username: account.username,
            isHost: account.id == game?.hostAccountId
        });
    }, [connectionStatus]);    

    if (!game || !account) {
        return <LoadingSpinner size="lg" center={true} />;
    }

    return (
        <>
            {game?.gameIsOver ? (
                <div className="flex justify-center">
                    <GameResultOverview
                        t={inGameTranslations}
                        lang={lang}
                        players={players}
                        thisPlayerIsHost={account.id == game.hostAccountId}
                        gameId={game.id}
                    />
                </div>
            ) : (
                <GameBoard
                    lang={lang}
                    generalTranslations={generalTranslations}
                    inGameTranslations={inGameTranslations}
                    settingsTranslations={settingsTranslations}
                    scoreTranslations={scoreTranslations}
                />
            )}
        </>
    )
}