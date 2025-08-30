"use server"

import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import PageBase from "@/components/layout/PageBase";
import { GetActiveGameByIdRequest } from "@/features/game/actions/query/get-active-game-by-id-request";
import IngameClient from "@/features/game/components/InGameClient";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { redirect } from "next/navigation";

export default async function PlayOnlineGamePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage, gameId: string }>
}) {
    const { lang, gameId } = await params;
    const t = await loadTranslations(lang, ["inGame", "general"]);

    // Game does not exist
    const game = await GetActiveGameByIdRequest(gameId);
    if (!game) {
        redirect(LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE));
    }

    return (
        <PageBase lang={lang} requiresAuh={true}>
            <IngameClient initialGameState={game} lang={lang} generalTranslations={t.general} inGameTranslations={t.inGame} />
        </PageBase>
    )
}
