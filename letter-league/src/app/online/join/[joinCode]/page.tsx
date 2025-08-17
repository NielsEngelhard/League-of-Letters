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
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import { useActiveGame } from "@/features/game/components/active-game-context";
import { MULTIPLAYER_GAME_ROUTE } from "@/app/routes";

export default function JoinOnlineGamePage() {
    const [lobby, setLobby] = useState<OnlineLobbyModel | null>(null);
    const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
    const { players, setInitialPlayers, clearGameState } = useActiveGame();
    const { pushSuccessMsg, pushLoadingMsg, pushErrorMsg } = useMessageBar();

    const { account } = useAuth();
    const router = useRouter();

    const params = useParams();
    const joinCode = params.joinCode;

    useEffect(() => {
        if (!account) return;
        pushLoadingMsg("Connecting with the realtime server");
        clearGameState();
        initializeConnection();
    }, [account]);

    useEffect(() => {
        if (players.length != 0) return;
        if (connectionStatus != "connected" || lobby || !joinCode || !account) return;
        pushLoadingMsg("Joining lobby");

        async function JoinLobby() {            
            if (!joinCode || !account) return;
            const serverResponse = await JoinGameLobbyCommand({ gameId: joinCode.toString() });

            if (!serverResponse.ok || !serverResponse.data) {
                pushErrorMsg(serverResponse.errorMsg);
                router.push(MULTIPLAYER_GAME_ROUTE);
                return;
            }

            setInitialPlayers(serverResponse.data.players);
            setLobby(serverResponse.data);
        }

        JoinLobby();
    }, [connectionStatus, players]);    

    useEffect(() => {        
        if (!lobby || !account) return;

        emitJoinGame({
            gameId: lobby.id,
            accountId: account.id,
            username: account.username,
            isHost: false
        });

        pushSuccessMsg("Connected");      
    }, [lobby, account]);    

    useEffect(() => {
        return () => {
            clearGameState();
        }
    }, []);    

    return (
        <PageBase>
        <>
            <Card variant={lobby ? "success" : "default"} className="animate-pulse-subtle">
            <CardHeader>
                <CardTitle className="text-success flex items-center gap-3">
                    {lobby ? "Joined Game" : ""}
                    <LoadingDots size="md" color={lobby ? "success" : "text"} />
                </CardTitle>
                {lobby && (
                    <span className="text-foreground font-medium flex items-center gap-2">
                        <LoadingSpinner size="sm" color="success" />
                        Waiting for host to start...
                    </span>                            
                )}
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
                        Players ({players.length})
                    </CardTitle>

                    <span className="italic text-xs">
                        max {MAX_ONLINE_GAME_PLAYERS}
                    </span>
                </CardHeader>
                <CardContent>
                    <PlayersList players={players} hostAccountId={lobby?.hostAccountId} />
                </CardContent>
            </Card>

            {/* Game Settings Overview */}
            {lobby && (
                <Card>
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="text-base sm:text-lg">Game Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground font-bold">Max Players:</span>
                            <div>{MAX_ONLINE_GAME_PLAYERS}</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-bold">Time Limit:</span>
                            <div>Unlimited time</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-bold">Game Type:</span>
                            <div>Private</div>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-bold">Created</span>
                            <div>{lobby?.createdAt.toDateString()}</div>
                        </div>
                        </div>
                    </CardContent>
                </Card> 
            )}
        </>
        </PageBase>
    )
}