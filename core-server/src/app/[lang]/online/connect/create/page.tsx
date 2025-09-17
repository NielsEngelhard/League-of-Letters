"use server"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import CreateOnlineLobbyCommand from "@/features/lobby/actions/command/create-online-lobby-command";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { redirect } from "next/navigation";
import CreateLobbyClient from "@/features/game/components/lobby/CreateLobbyClient";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";
import LobbyOptions from "@/features/game/components/lobby/LobbyOptions";
import { Authenticate_Server } from "@/features/auth/current-user";
import ShareGameCard from "@/features/lobby/components/ShareGameCard";
import { Settings, Users } from "lucide-react";
import ActiveGamePlayersGrid from "@/features/game/components/in-game/ActiveGamePlayersGrid";

export default async function CreateOnlineGamePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["beforeGame", "inGame"]);

    const authenticatedUser = await Authenticate_Server(true);
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

      {/* players bar */}
      <div className="flex flex-col gap-1">
          <CardTitle>
            <Users />
            {t.beforeGame.lobby.join.players}
            <sup className="text-foreground-muted text-xs">max 6</sup>
          </CardTitle>
          <ActiveGamePlayersGrid
            t={t.inGame}
            includeKickOption={true}
            gameId={lobby.id}
            hostAccountId={lobby.hostAccountId}
          />
      </div>    

      {/* game config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left */}
          <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <Settings />
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

          {/* Right */}
          <div className="flex flex-col gap-2">  
            {/* Share options */}
            <ShareGameCard joinCode={lobby.id} lang={lang} t={t.beforeGame} />
          </div>
      </div>        
    </PageBase>
  )
}
