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
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import CreateOnlineLobbyCommand from "@/features/lobby/actions/command/create-online-lobby-command";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import CreateOnlineGameBasedOnLobbyCommand from "@/features/lobby/actions/command/create-online-game-based-on-lobby-command";
import { OptionItem } from "@/components/ui/OptionsMenu";
import DeleteOnlineLobbyById from "@/features/lobby/actions/command/delete-online-lobby";
import { useActiveGame } from "@/features/game/components/active-game-context";
import { GamePlayerModel } from "@/features/game/game-models";

export default function CreateOnlineGamePage() {
  const router = useRouter()
  const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
  const { players, addOrReconnectPlayer } = useActiveGame();
  const { pushMessage, clearMessage } = useMessageBar();
  const { account } = useAuth();

  const [lobby, setLobby] = useState<OnlineLobbyModel | null>(null);
  const [copiedGameId, setCopiedGameId] = useState(false);

  useEffect(() => {
      async function SetupRealtimeConnection() {
          initializeConnection();
      }

      SetupRealtimeConnection();
  }, []);

  useEffect(() => {
    async function CreateOrGetLobby() {
      if (connectionStatus != "connected" || lobby || !account) return;

      const lobbyResponse = await GetOrCreateLobbyFromServer();
      addPlayersToRealtimePlayersList(lobbyResponse.players);
      setLobby(lobbyResponse);

      emitJoinGame({
        gameId: lobbyResponse.id,
        userId: account.id,
        username: account.username,
        isHost: true
      });
    }

    CreateOrGetLobby();
  }, [connectionStatus]);

  function addPlayersToRealtimePlayersList(players: GamePlayerModel[]) {
    players.forEach(p => {
      addOrReconnectPlayer(p);
    });
  }

  async function GetOrCreateLobbyFromServer(): Promise<OnlineLobbyModel> {
      if (!account) throw Error("NOT LOGGED IN");

      const response = await CreateOnlineLobbyCommand({
        hostUserId: account.id
      });

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
  
  async function onSubmit(data: CreateGameSchema) {
    await CreateOnlineGameBasedOnLobbyCommand(data);
  }  

  async function abandonLobby() {
    if (!lobby) return;
    await DeleteOnlineLobbyById(lobby.id, undefined, true);
  }

  const lobbyOptions: OptionItem[] = [
  {
    label: "Abandon",
    onClick: abandonLobby,
    destructive: true
  }
]

  return (
    <PageBase size="lg">
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={MULTIPLAYER_GAME_ROUTE} options={lobbyOptions}>
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
                {lobby ? (
                  <CreateGameForm
                    gameId={lobby?.id}
                    onSubmit={onSubmit}
                    submitDisabled={!lobby?.id}
                    gameMode="online" 
                    players={players.map((p) => ({ userId: p.userId, username: p.username }))}
                  />
                ) : (
                  <LoadingDots />
                )}                
              </CardContent>
            </Card>       
            <Card>
              <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Players ({players.length})
                    <sup className="italic text-xs font-normal">max {MAX_ONLINE_GAME_PLAYERS}</sup>
                  </CardTitle>

                  <LoadingDots color="success" size="md" />
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                  <PlayersList players={players} userHostId={lobby?.userHostId} />
              </CardContent>
            </Card>
        </div>
    </PageBase>
  )
}
