"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { AuthSessionModel } from "@/features/auth/auth-models";
import { PICK_GAME_MODE_ROUTE } from "@/app/routes";
import { useSocket } from "@/features/realtime/socket-context";
import CreateGameLobbyCommand from "@/features/game/actions/command/create-game-lobby-command";
import { splitStringInMiddle } from "@/lib/string-util";
import PlayersList from "@/features/game/components/PlayersList";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { Check, Copy, User } from "lucide-react";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import Icon from "@/components/ui/Icon";

export default function CreateOnlineGamePage() {
  const router = useRouter()
  const { getOrCreateGuestAuthSession } = useAuth();
  const { initializeConnection, emitJoinGame, connectedPlayers, connectionStatus } = useSocket();
  const { pushMessage, clearMessage } = useMessageBar();

  const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [copiedGameId, setCopiedGameId] = useState(false);

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
    if (!authSession || connectionStatus == "connected") return;

    pushMessage({
      msg: "Setting up realtime connection",
      type: "loading"
    }, null);

    initializeConnection();
  }, [authSession]);

  useEffect(() => {
    if (connectionStatus != "connected" || !authSession) return;

    pushMessage({
      msg: "Creating lobby",
      type: "loading"
    }, null);

    createLobby()
      .then((gameId) => {
        setGameId(gameId);
        emitJoinGame({
          gameId: gameId,
          userId: authSession.id,
          username: authSession.username,
          isHost: true
        });

        clearMessage();     
      });

  }, [connectionStatus, authSession]);

  function login() {
    getOrCreateGuestAuthSession()
    .then((response) => {
        setAuthSession(response);
    })
    .catch(() => {
        router.push(PICK_GAME_MODE_ROUTE);
    });    
  }

  async function createLobby(): Promise<string> {
    if (!authSession) return "ERROR";

    const gameId = await CreateGameLobbyCommand({
      hostUserId: authSession.id
    }, authSession.secretKey);
  
    return gameId;
  }

  async function onSubmit(data: CreateGameSchema) {

  }

  async function copyJoinCodeToClipboard() {
    if (!gameId) return;

    await navigator.clipboard.writeText(gameId);
    setCopiedGameId(true);
  }

  return (
    <PageBase size="lg">
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={PICK_GAME_MODE_ROUTE}>
        <div className="text-3xl font-bold">
          {gameId ? (
            <button className="flex flex-row cursor-pointer" onClick={copyJoinCodeToClipboard}>
              {splitStringInMiddle(gameId ?? "")}
              {copiedGameId ? (
                <div className="text-success"><Icon LucideIcon={Check} size="xs" /></div>
              ) : (
                <Icon LucideIcon={Copy} size="xs" />
              )}
            </button>
          ) : "Loading..."}
        </div>
      </PageIntro>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>
                  Game Settings
                </CardTitle>
                <SubText text="Customize your game" />    
              </CardHeader>
              <CardContent>
                <CreateGameForm onSubmit={onSubmit} submitDisabled={!gameId} />                
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
              <CardContent className="space-y-2 sm:space-y-3">
                  <PlayersList players={connectedPlayers} />
              </CardContent>
            </Card>     
        </div>
    </PageBase>
  )
}
