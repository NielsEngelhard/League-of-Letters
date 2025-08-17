"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { JOIN_GAME_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
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
import CopyTextBlock from "@/components/ui/CopyTextBlock";

export default function CreateOnlineGamePage() {
  const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
  const { players, setInitialPlayers, clearGameState } = useActiveGame();
  const { pushSuccessMsg, pushLoadingMsg, pushErrorMsg } = useMessageBar();
  const { account } = useAuth();

  const [lobby, setLobby] = useState<OnlineLobbyModel | null>(null);
  const [copiedGameId, setCopiedGameId] = useState(false);

  // On initial load, connect with the websocket server
  useEffect(() => {
      if (!account) return;

      clearGameState();
      pushLoadingMsg("Connecting with the realtime server");
      initializeConnection();
  }, [account]);

  useEffect(() => {
    async function CreateOrGetLobby() {
      if (players?.length != 0) return;
      if (connectionStatus != "connected" || lobby || !account) return;

      pushLoadingMsg("Connecting to lobby");

      const lobbyResponse = await GetOrCreateLobbyFromServer();
      addInitialPlayers(lobbyResponse.players);
      setLobby(lobbyResponse);    
    }

    CreateOrGetLobby();
  }, [connectionStatus, players]);

  useEffect(() => {
    if (!lobby || !account) return;
      emitJoinGame({
        gameId: lobby.id,
        accountId: account.id,
        username: account.username,
        isHost: true
      });

      pushSuccessMsg("Connected");      
  }, [lobby, account]);

  function addInitialPlayers(players: GamePlayerModel[]) {
    setInitialPlayers(players);
  }

  async function GetOrCreateLobbyFromServer(): Promise<OnlineLobbyModel> {
      if (!account) throw Error("NOT LOGGED IN");

      const response = await CreateOnlineLobbyCommand({
        hostUserId: account.id
      });

      if (!response.ok || !response.data) {
        pushErrorMsg(response.errorMsg);        
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

  useEffect(() => {
    clearGameState();
  }, []);

  return (
    <PageBase size="lg">
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={MULTIPLAYER_GAME_ROUTE} options={lobbyOptions}>
        <div className="text-3xl font-bold">
          {lobby ? (
            <div className="flex flex-col items-center">
              {/* Join Code */}
              <button className="flex flex-row cursor-pointer" onClick={copyJoinCodeToClipboard}>
                {splitStringInMiddle(lobby.id ?? "")}
                {copiedGameId ? (
                  <div className="text-success"><Icon LucideIcon={Check} size="xs" /></div>
                ) : (
                  <Icon LucideIcon={Copy} size="xs" />
                )}
              </button>

              {/* Join Url */}
              <CopyTextBlock label="Game link" value={`${window.location.origin}/${JOIN_GAME_ROUTE(lobby.id)}`} />
            </div>
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
                    players={players.map((p) => ({ accountId: p.accountId, username: p.username }))}
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
                  <PlayersList
                    players={players}
                    hostAccountId={lobby?.hostAccountId}
                    lobbyId={lobby?.id}
                  />
              </CardContent>
            </Card>
        </div>
    </PageBase>
  )
}
