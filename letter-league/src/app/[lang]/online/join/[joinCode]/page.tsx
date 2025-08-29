"use server"

import PageBase from "@/components/layout/PageBase";
import Card from "@/components/ui/card/Card";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import JoinGameLobbyCommand from "@/features/lobby/actions/command/join-online-lobby-command";
import { MAX_ONLINE_GAME_PLAYERS } from "@/features/game/game-constants";
import { redirect } from "next/navigation";
import LoadingSpinner from "@/components/ui/animation/LoadingSpinner";
import LoadingDots from "@/components/ui/animation/LoadingDots";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { isAuthenticated_Server } from "@/features/auth/utils/auth-server-utils";
import AuthenticationRequiredBlock from "@/components/layout/AuthenticationRequiredBlock";
import JoinedLobbyClient from "@/features/game/components/lobby/JoinedLobbyClient";

export default async function JoinOnlineGamePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage, joinCode: string }>
}) {
    const { lang, joinCode } = await params;
    const t = await loadTranslations(lang, ["beforeGame"]);

    const isAuthenticated = await isAuthenticated_Server();
    if (!isAuthenticated) {
        return <AuthenticationRequiredBlock lang={lang} />
    }

    const serverResponse = await JoinGameLobbyCommand({ gameId: joinCode.toString() });
    if (!serverResponse.ok || !serverResponse.data) {
        redirect(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
    }    

    const lobby = serverResponse.data;

    return (
        <PageBase lang={lang}>
        <>
            <Card variant={lobby ? "success" : "default"} className="animate-pulse-subtle">
            <CardHeader>
                <CardTitle className="text-success flex items-center gap-3">
                    {lobby ? t.beforeGame.lobby.join.title : ""}
                    <LoadingDots size="md" color={lobby ? "success" : "text"} />
                </CardTitle>
                <span className="text-foreground font-medium flex items-center gap-2">
                    <LoadingSpinner size="sm" color="success" />
                    {t.beforeGame.lobby.join.wating}
                </span>
            </CardHeader>

            <CardContent>
                <ul className="text-sm text-foreground-muted">
                    <li>Game ID: {joinCode}</li>
                </ul>
            </CardContent>
            </Card>

            <JoinedLobbyClient hostAccountId={lobby.hostAccountId} initialLobby={lobby} />

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