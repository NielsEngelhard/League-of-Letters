"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameBasedOnLobbySchema, CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import { useSocket } from "@/features/realtime/socket-context";
import { splitStringInMiddle } from "@/lib/string-util";
import PlayersList from "@/features/lobby/components/OnlineLobbyPlayerList";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { Check, Copy, User } from "lucide-react";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import Icon from "@/components/ui/Icon";
import { copyToClipboard } from "@/lib/clipboard-util";
import { OnlineLobbyModel, OnlineLobbyPlayerModel } from "@/features/lobby/lobby-models";
import CreateOnlineLobbyCommand from "@/features/lobby/actions/command/create-online-lobby-command";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import CreateOnlineGameBasedOnLobbyCommand from "@/features/lobby/actions/command/create-online-game-based-on-lobby-command";
import { GameMode } from "@/drizzle/schema";

export default function CreateOnlineGamePage() {
  const router = useRouter()
  const { getOrCreateGuestAuthSession } = useAuth();
  const { initializeConnection, emitJoinGame, connectionStatus, connectedPlayers, addPlayerOrSetReconnected } = useSocket();
  const { pushMessage, clearMessage } = useMessageBar();

  const [lobby, setLobby] = useState<OnlineLobbyModel | null>(null);
  const [copiedGameId, setCopiedGameId] = useState(false);

  useEffect(() => {
      async function LoginAndSetupRealtimeConnection() {
          await getOrCreateGuestAuthSession();
          initializeConnection();
      }

      LoginAndSetupRealtimeConnection();
  }, []);

  useEffect(() => {
    async function CreateOrGetLobby() {
      if (connectionStatus != "connected" || lobby) return;

      const lobbyResponse = await GetOrCreateLobbyFromServer();
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

    CreateOrGetLobby();
  }, [connectionStatus]);

  function addPlayersToRealtimePlayersList(players: OnlineLobbyPlayerModel[]) {
    players.forEach(player => addPlayerOrSetReconnected(player));
  }

  async function GetOrCreateLobbyFromServer(): Promise<OnlineLobbyModel> {
      const authSession = await getOrCreateGuestAuthSession();

      const response = await CreateOnlineLobbyCommand({
        hostUserId: authSession.id
      }, authSession.secretKey);

      if (!response.ok || !response.data) {
        pushMessage({ msg: response.errorMsg, type: "error" }, null);        
        throw Error("Something went wrong");
      }

      return response.data;
  }

  async function copyJoinCodeToClipboard() {
    await copyToClipboard(lobby?.id);
    setCopiedGameId(true);
  }
  
  async function onSubmit(data: CreateGameBasedOnLobbySchema | CreateGameSchema) {
    debugger;
    const authSession = await getOrCreateGuestAuthSession();
    CreateOnlineGameBasedOnLobbyCommand(data as CreateGameBasedOnLobbySchema, authSession.secretKey);
    // EMIT CREATING EVENT
    // START IN DATABASE
  }  

  return (
    <PageBase size="lg">
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={MULTIPLAYER_GAME_ROUTE}>
        <div className="text-3xl font-bold">
          {lobby ? (
            <button className="flex flex-row cursor-pointer" onClick={copyJoinCodeToClipboard}>
              {splitStringInMiddle(lobby.id ?? "")}
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
                <CreateGameForm
                  onSubmit={onSubmit}
                  submitDisabled={!lobby?.id}
                  gameMode={GameMode.Online} 
                  players={connectedPlayers.map((p) => ({ userId: p.userId, username: p.username }))}
                />                
              </CardContent>
            </Card>       
            <Card>
              <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Players ({connectedPlayers.length})
                    <sup className="italic text-xs font-normal">max {MAX_ONLINE_GAME_PLAYERS}</sup>
                  </CardTitle>

                  <LoadingDots color="success" size="md" />
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                  <PlayersList players={connectedPlayers} userHostId={lobby?.userHostId} />
              </CardContent>
            </Card>     
        </div>
    </PageBase>
  )
}
