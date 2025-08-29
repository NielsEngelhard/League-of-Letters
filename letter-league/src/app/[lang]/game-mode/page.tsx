import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { User, Users } from "lucide-react";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "../../routes";
import ReconnectGamesOverview from "@/features/game/components/ReconnectGamesOverview";
import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { APP_NAME } from "@/app/global-constants";

export default async function GameModePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {  
  const { lang } = await params;
  const t = await loadTranslations(lang, ["beforeGame"]);

  return (
    <PageBase requiresAuh={false}>
      <PageIntro
        title={APP_NAME}
        subText={t.beforeGame.gameMode.description}
        titleColor="gradient"
        titleSize="lg">
      </PageIntro>      
      
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <GameModeCard
          title={t.beforeGame.gameMode.multiplayer.title}
          subTxt={t.beforeGame.gameMode.multiplayer.description} 
          btnTxt={t.beforeGame.gameMode.multiplayer.btn}
          href={LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE)}
          Icon={Users}
          variant="secondaryGradient"
        />           
        
        <GameModeCard
          title={t.beforeGame.gameMode.solo.title}
          subTxt={t.beforeGame.gameMode.solo.description} 
          btnTxt={t.beforeGame.gameMode.solo.btn}
          href={LANGUAGE_ROUTE(lang, SOLO_GAME_ROUTE)}
          Icon={User}
          variant="primaryGradient"
        />           
      </div>

      <ReconnectGamesOverview lang={lang} />

      <div className="text-center text-sm text-foreground-muted">
        {t.beforeGame.gameMode.scoreRedirect.sentence} <Link href={LANGUAGE_ROUTE(lang, SCORE_ROUTE)} className="font-bold underline text-primary">{t.beforeGame.gameMode.scoreRedirect.clickHere}</Link>
      </div>

    </PageBase>
  )
}