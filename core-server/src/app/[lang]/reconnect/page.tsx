"use server"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "../../routes";
import ReconnectGamesOverview from "@/features/game/components/ReconnectGamesOverview";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";

export default async function ReconnectPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["general"]);

  return (
    <PageBase size="md" lang={lang} requiresAuh={true}>
  
        <PageIntro title={t.general.reconnect.title} subText={t.general.reconnect.title} backHref={LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE)}>

        </PageIntro>

        <ReconnectGamesOverview lang={lang} t={t.general}/>
    </PageBase>
  )
}