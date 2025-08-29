"use server"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";
import { useEffect, useState } from "react";
import { JOIN_GAME_ROUTE, LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
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
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { redirect } from "next/navigation";
import LobbyJoinCode from "@/features/game/components/lobby/LobbyJoinCode";
import LobbyJoinLink from "@/features/game/components/lobby/LobbyJoinLink";
import CreateLobbyClient from "@/features/game/components/lobby/CreateLobbyClient";
import { isAuthenticated_Server } from "@/features/auth/utils/auth-server-utils";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";

export default async function CreateOnlineGamePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["beforeGame"]);

    const isAuthenticated = await isAuthenticated_Server();
    if (!isAuthenticated) {
        return <AuthenticationRequiredBlock lang={lang} />
    }

    const response = await CreateOnlineLobbyCommand();
    if (!response || !response.ok || response.data == null) {
      redirect(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
    }

    const lobby = response.data;

  // const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
  // const { players, setInitialPlayers, clearGameState } = useActiveGame();
  // const { pushSuccessMsg, pushLoadingMsg, pushErrorMsg } = useMessageBar();
  // const { account } = useAuth();

  // On initial load, connect with the websocket server
  // useEffect(() => {
  //     if (!account) return;

  //     clearGameState();
  //     pushLoadingMsg("Connecting with the realtime server");
  //     initializeConnection();
  // }, [account]);

  // useEffect(() => {
  //   async function CreateOrGetLobby() {
  //     if (players?.length != 0) return;
  //     if (connectionStatus != "connected" || lobby || !account) return;

  //     pushLoadingMsg("Connecting to lobby");

  //     const lobbyResponse = await GetOrCreateLobbyFromServer();
  //     addInitialPlayers(lobbyResponse.players);
  //     setLobby(lobbyResponse);    
  //   }

  //   CreateOrGetLobby();
  // }, [connectionStatus, players]);

  // useEffect(() => {
  //   if (!lobby || !account) return;
  //     emitJoinGame({
  //       gameId: lobby.id,
  //       accountId: account.id,
  //       username: account.username,
  //       isHost: true
  //     });

  //     pushSuccessMsg("Connected");      
  // }, [lobby, account]);

  // function addInitialPlayers(players: GamePlayerModel[]) {
  //   setInitialPlayers(players);
  // }

  // async function GetOrCreateLobbyFromServer(): Promise<OnlineLobbyModel> {
  //     if (!account) throw Error("NOT LOGGED IN");

  //     const response = await CreateOnlineLobbyCommand({
  //       hostUserId: account.id
  //     });

  //     if (!response.ok || !response.data) {
  //       pushErrorMsg(response.errorMsg);        
  //       throw Error("Something went wrong");
  //     }

  //     return response.data;
  // }


  
  // async function onSubmit(data: CreateGameSchema) {
  //   await CreateOnlineGameBasedOnLobbyCommand(data);
  // }  

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

  // useEffect(() => {
  //   clearGameState();
  // }, []);

  return (
    <PageBase size="lg" lang={lang} requiresAuh={true}>
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE)} >
        <div className="text-3xl font-bold">
            <div className="flex flex-col items-center">
              {/* Join Code */}
              <LobbyJoinCode joinCode={lobby.id} />

              {/* Join Url */}
              <LobbyJoinLink lang={lang} label="Join Link" joinCode={lobby.id} />
            </div>
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
              <CreateLobbyClient
                lang={lang}
                t={t.beforeGame}
                initialLobby={lobby}
              />            
            </CardContent>
          </Card>       
          <Card>
            <CardHeader className="pb-3 sm:pb-4 justify-between flex flex-row">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {/* Players ({players.length}) */}
                  <sup className="italic text-xs font-normal">max {MAX_ONLINE_GAME_PLAYERS}</sup>
                </CardTitle>

                <LoadingDots color="success" size="md" />
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
                <PlayersList
                  hostAccountId={lobby?.hostAccountId}
                  lobbyId={lobby?.id}
                />
            </CardContent>
          </Card>
      </div>
    </PageBase>
  )
}
