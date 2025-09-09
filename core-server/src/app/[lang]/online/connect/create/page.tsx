"use server"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import PlayersList from "@/features/lobby/components/OnlineLobbyPlayerList";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { User } from "lucide-react";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import CreateOnlineLobbyCommand from "@/features/lobby/actions/command/create-online-lobby-command";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { redirect } from "next/navigation";
import CreateLobbyClient from "@/features/game/components/lobby/CreateLobbyClient";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";
import LobbyOptions from "@/features/game/components/lobby/LobbyOptions";
import { Authenticate_Server } from "@/features/auth/current-user";
import JoinCodeCard from "@/features/lobby/components/JoinCodeCard";

export default async function CreateOnlineGamePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["beforeGame"]);

    const authenticatedUser = await Authenticate_Server();
    if (!authenticatedUser) {
        return <AuthenticationRequiredBlock lang={lang} />
    }

    const response = await CreateOnlineLobbyCommand();
    if (!response || !response.ok || response.data == null) {
      redirect(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
    }

    const lobby = response.data;

  return (
    <PageBase size="lg" lang={lang} requiresAuh={true}>
      <PageIntro
        title={t.beforeGame.lobby.create.title}
        backHref={LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE)}
        rightUpperCorner={<LobbyOptions lobbyId={lobby.id} />}
      >               
      </PageIntro>      

      <JoinCodeCard joinCode={lobby.id} lang={lang} />

      <div className="flex flex-col lg:flex-row-reverse gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {t.beforeGame.createGameForm.title}
              </CardTitle>
              <SubText text={t.beforeGame.createGameForm.description} />    
            </CardHeader>
            <CardContent>
              <CreateLobbyClient
                lang={authenticatedUser.language}
                t={t.beforeGame}
                initialLobby={lobby}
                accountId={authenticatedUser.accountId}
                username={authenticatedUser.username}
              />            
            </CardContent>
          </Card>       
          <Card className="w-full">
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
