"use client"

import { useMessageBar } from "@/components/layout/MessageBarContext";
import PageBase from "@/components/layout/PageBase";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { useAuth } from "@/features/auth/AuthContext";
import JoinGameLobbyCommand from "@/features/lobby/actions/command/join-online-lobby-command";
import PlayersList from "@/features/lobby/components/OnlineLobbyPlayerList";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import { useSocket } from "@/features/realtime/socket-context";
import { User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OnlineLobbyModel, OnlineLobbyPlayerModel } from "@/features/lobby/lobby-models";

export default function JoinOnlineGamePage() {
    const [lobby, setLobby] = useState<OnlineLobbyModel | null>(null);
    const { initializeConnection, emitJoinGame, connectedPlayers, connectionStatus, addPlayerOrSetReconnected } = useSocket();
    const { pushMessage, clearMessage } = useMessageBar();

    const { getOrCreateGuestAuthSession } = useAuth();
    const router = useRouter();

    const params = useParams();
    const joinCode = params.joinCode;

    useEffect(() => {
        async function LoginAndSetupRealtimeConnection() {
            await getOrCreateGuestAuthSession();
            initializeConnection();
        }

        LoginAndSetupRealtimeConnection();
    }, []);

    useEffect(() => {
        async function JoinLobby() {
            if (connectionStatus != "connected" || lobby || !joinCode) return;

            const lobbyResponse = await JoinLobbyOnServer(joinCode.toString());

            addPlayersToRealtimePlayersList(lobbyResponse.players);
            setLobby(lobbyResponse);

            const authSession = await getOrCreateGuestAuthSession();
            emitJoinGame({
                gameId: lobbyResponse.id,
                userId: authSession.id,
                username: authSession.username,
                isHost: true
            });    
        }

        JoinLobby();
    }, [connectionStatus]);    

    function addPlayersToRealtimePlayersList(players: OnlineLobbyPlayerModel[]) {
        players.forEach(player => addPlayerOrSetReconnected(player));
        }    

        async function JoinLobbyOnServer(gameId: string): Promise<OnlineLobbyModel> {
        const authSession = await getOrCreateGuestAuthSession();

        const response = await JoinGameLobbyCommand({
            gameId: gameId
        }, authSession.secretKey);

        if (!response.ok || !response.data) {
            pushMessage({ msg: response.errorMsg, type: "error" }, null);        
            throw Error("Something went wrong");
        }

        return response.data;
    }  

    return (
        <PageBase>
            {connectedPlayers ? (
                <>
                    <Card variant="success">
                        <CardHeader>
                            <CardTitle className="text-success">
                                Joined Game
                            </CardTitle>
                            <span className="text-foreground font-medium">
                                Waiting for host to start...
                            </span>
                        </CardHeader>

                        <CardContent>
                            <ul className="text-sm text-foreground-muted">
                                <li>Game ID: {joinCode?.toString()}</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Players ({connectedPlayers.length})
                            </CardTitle>

                            <span className="italic text-xs">
                                max {MAX_ONLINE_GAME_PLAYERS}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <PlayersList players={connectedPlayers} userHostId={lobby?.userHostId} />
                        </CardContent>
                    </Card>
                </>
            ): (
                <div>Loading...</div>
            )}
        </PageBase>
    )
}