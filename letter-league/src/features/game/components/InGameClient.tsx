"use client"

import { useEffect } from "react";
import { ActiveGameModel } from "../game-models";
import { useActiveGame } from "./active-game-context";
import GameBoard from "./GameBoard";
import GameResultOverview from "./GameResultOverview";
import { useAuth } from "@/features/auth/AuthContext";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import { SupportedLanguage } from "@/features/i18n/languages";
import { useSocket } from "@/features/realtime/socket-context";
import { useMessageBar } from "@/components/layout/MessageBarContext";

interface Props {
    initialGameState: ActiveGameModel;
    lang: SupportedLanguage;
}

export default function IngameClient({ initialGameState, lang }: Props) {
    const { initializeGameState, game, clearGameState, players } = useActiveGame();    
    const { initializeConnection, emitJoinGame, connectionStatus } = useSocket(); 
    const { clearMessage, pushLoadingMsg } = useMessageBar();
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
        initializeGameState(initialGameState, account.id);
    }, [account]);

    // Connect with realtime if online game
    useEffect(() => {
        if (connectionStatus == "connected") return;

        if (game && game.gameMode == "online") {
            pushLoadingMsg("Connecting with the realtime server");
            initializeConnection();
        }
    }, [game]);

    // Join the game room when realtime is connected
    useEffect(() => {
        if (!account || connectionStatus != "connected") return;

        clearMessage();
        emitJoinGame({
            gameId: initialGameState.id,
            accountId: account.id,
            username: account.username,
            isHost: account.id == game?.hostAccountId
        });                      
    }, [connectionStatus]);    

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