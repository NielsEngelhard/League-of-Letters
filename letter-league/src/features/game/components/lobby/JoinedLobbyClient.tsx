"use client"

import Card from "@/components/ui/card/Card"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children"
import { User } from "lucide-react"
import { useActiveGame } from "../active-game-context"
import { MAX_ONLINE_GAME_PLAYERS } from "../../game-constants"
import OnlineLobbyPlayerList from "@/features/lobby/components/OnlineLobbyPlayerList"
import { useEffect } from "react"
import { useSocket } from "@/features/realtime/socket-context"
import { OnlineLobbyModel } from "@/features/lobby/lobby-models"
import { useAuth } from "@/features/auth/AuthContext"
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes"
import { redirect } from "next/navigation"
import { SupportedLanguage } from "@/features/i18n/languages"

interface Props {
    hostAccountId: string;
    initialLobby: OnlineLobbyModel;
    lang: SupportedLanguage;
    accountId: string;
    username: string;
}

export default function JoinedLobbyClient({ hostAccountId, initialLobby, lang, accountId, username }: Props) {
    const { players, setInitialPlayers } = useActiveGame();
    const { emitJoinGame, connectionStatus } = useSocket();
    const { account } = useAuth();
    
    // Join the websocket room
    useEffect(() => {
        if (connectionStatus != "connected" || !initialLobby || !accountId) {
          redirect(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
        }; 
        
        setInitialPlayers(initialLobby.players);

        emitJoinGame({
            gameId: initialLobby.id,
            accountId: accountId,
            username: username,
            isHost: false
        });

    }, [connectionStatus, account]);

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Players {players?.length ?? 0}
                </CardTitle>

                <span className="italic text-xs">
                    max {MAX_ONLINE_GAME_PLAYERS}
                </span>
            </CardHeader>
            <CardContent>
                <OnlineLobbyPlayerList hostAccountId={hostAccountId} />
            </CardContent>
        </Card>
    )
}