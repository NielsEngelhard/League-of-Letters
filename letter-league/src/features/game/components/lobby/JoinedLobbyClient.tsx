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
import { useMessageBar } from "@/components/layout/MessageBarContext"
import { useAuth } from "@/features/auth/AuthContext"

interface Props {
    hostAccountId: string;
    initialLobby: OnlineLobbyModel;
}

export default function JoinedLobbyClient({ hostAccountId, initialLobby }: Props) {
    const { players, setInitialPlayers, clearGameState, game } = useActiveGame();
    const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
    const { pushSuccessMsg, pushLoadingMsg } = useMessageBar();
    const { account } = useAuth();
    
    // Clear game state when discarding the client
    useEffect(() => {
        return () => {
            clearGameState();
        }
    }, []);

    // Initialize game
    useEffect(() => {
      if (!account) return;

      setInitialPlayers(initialLobby.players);
    }, [account]);        

    // When lobby set, initialize realtime connection
    useEffect(() => {
      if (!players || players.length < 1 || connectionStatus == "connected") return;
      pushLoadingMsg("Connecting with the realtime server");
      initializeConnection();
    }, [players]);

    // Handle realtime connection connected
    useEffect(() => {
        if (connectionStatus != "connected" || !account) return; 
        
        emitJoinGame({
            gameId: initialLobby.id,
            accountId: account.id,
            username: account.username,
            isHost: false
        });

        pushSuccessMsg("Connected");
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