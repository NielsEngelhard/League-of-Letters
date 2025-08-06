"use client"

import { MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import { AuthSessionModel } from "@/features/auth/auth-models";
import { useAuth } from "@/features/auth/AuthContext";
import JoinGameLobbyCommand from "@/features/game/actions/command/join-online-game-command";
import { GamePlayerModel } from "@/features/game/game-models";
import { useSocket } from "@/features/realtime/socket-context";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JoinOnlineGamePage() {
    const [playersInLobby, setPlayersInLobby] = useState<GamePlayerModel[] | null>(null);
    const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);
    const { initializeConnection, emitJoinGame, connectedPlayers, connectionStatus } = useSocket();
    const [error, setError] = useState<string | null>(null);

    const { getOrCreateGuestAuthSession } = useAuth();
    const router = useRouter();

    const params = useParams();
    const joinCode = params.joinCode;

    useEffect(() => {
        login();
    }, []);

    useEffect(() => {
        if (!joinCode || !authSession) return;

        JoinGameLobbyCommand({ gameId: joinCode.toString() }, authSession.secretKey)
        .then((resp) => {
            if (!resp.ok) {
                setError(resp.errorMsg ?? "Error");
                return;
            }

            setPlayersInLobby(resp.players);            
        })
        .catch(() => {
            setError("Server Error");
        });
    }, [authSession]);    

  useEffect(() => {
    if (!playersInLobby || playersInLobby.length < 1 || !joinCode || !authSession) return;

    initializeConnection();
    emitJoinGame({ gameId: joinCode.toString(), userId: authSession.id, username: authSession.username });

  }, [playersInLobby]);  

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
            {playersInLobby ? (
                <div>joined</div>
            ): (
                <div>not joined</div>
            )}
        </PageBase>
    )
}