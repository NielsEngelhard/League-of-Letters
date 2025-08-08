"use client"

import { MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import PageBase from "@/components/layout/PageBase";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { AuthSessionModel } from "@/features/auth/auth-models";
import { useAuth } from "@/features/auth/AuthContext";
import JoinGameLobbyCommand from "@/features/game/actions/command/join-online-game-command";
import PlayersList from "@/features/game/components/PlayersList";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import { useSocket } from "@/features/realtime/socket-context";
import { User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinOnlineGamePage() {
    const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);
    const { initializeConnection, emitJoinGame, connectedPlayers, addConnectedPlayers, connectionStatus } = useSocket();
    const { pushMessage, clearMessage } = useMessageBar();

    const { getOrCreateGuestAuthSession } = useAuth();
    const router = useRouter();

    const params = useParams();
    const joinCode = params.joinCode;

    useEffect(() => {
        if (authSession) return;

        pushMessage({
            msg: "Creating session",
            type: "loading"
        }, null);

        login();

        return () => {
            clearMessage();
        }
    }, []);

    useEffect(() => {
        if (!joinCode || !authSession) return;

        pushMessage({
            msg: "Joining game",
            type: "loading"
        }, null);

        JoinGameLobbyCommand({ gameId: joinCode.toString() }, authSession.secretKey)
        .then((resp) => {
            if (!resp.ok) {
                pushMessage({
                    msg: resp.errorMsg ?? "Server error",
                    type: "error"
                }, null);
                return;
            }

            addConnectedPlayers(resp.players);
        })
        .catch(() => {
            pushMessage({
                msg: "Server error",
                type: "error"
            }, null);
        });
    }, [authSession]);    

  useEffect(() => {
    if (!connectedPlayers || !joinCode || !authSession) return;

    pushMessage({
        msg: "Setting up realtime server connection",
        type: "loading"
    }, null);

    initializeConnection();        

  }, [connectedPlayers]);

  useEffect(() => {
    if (!connectedPlayers || connectionStatus != "connected" || !authSession) return;

    // emitJoinGame({ gameId: joinCode!.toString(), userId: authSession.id, username: authSession.username });

    pushMessage({
        msg: "Connected",
        type: "live-connected"
    }, null);

  }, [connectedPlayers, connectionStatus, authSession]);

  function login() {
    getOrCreateGuestAuthSession()
    .then((response) => {
        setAuthSession(response);
    })
    .catch(() => {
        router.push(MULTIPLAYER_GAME_ROUTE);
    });    
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
                            <PlayersList players={connectedPlayers} />
                        </CardContent>
                    </Card>
                </>
            ): (
                <div>Loading...</div>
            )}
        </PageBase>
    )
}