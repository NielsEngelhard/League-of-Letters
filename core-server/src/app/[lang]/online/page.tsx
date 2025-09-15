"use server"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { Gamepad, Plus, Search } from "lucide-react";
import { CREATE_MULTIPLAYER_GAME_ROUTE, LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "../../routes";
import { loadTranslations } from "@/features/i18n/utils";
import { SupportedLanguage } from "@/features/i18n/languages";
import JoinGameForm from "@/features/game/components/JoinGameForm";
import Button from "@/components/ui/Button";
import NotificationBanner from "@/components/ui/NotificationBanner";

export default async function OnlinePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
    const { lang } = await params;
    const t = await loadTranslations(lang, ["beforeGame"]);

  return (
    <PageBase lang={lang} size="lg">
      <PageIntro title="Online Game" subText={t.beforeGame.online.description} backHref={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>

      </PageIntro>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <GameModeCard
          title={t.beforeGame.online.joinGame.title}
          subTxt={t.beforeGame.online.joinGame.description}
          btnTxt={t.beforeGame.online.joinGame.btnText}
          Icon={Gamepad}
          variant="primary"
        >
          <JoinGameForm
            lang={lang}
            label={t.beforeGame.online.joinGame.inputLabel}
            btnTxt={t.beforeGame.online.joinGame.btnText}
          />
        </GameModeCard>
        
        <GameModeCard
          title={t.beforeGame.online.createGame.title}
          subTxt={t.beforeGame.online.createGame.description}
          btnTxt={t.beforeGame.online.createGame.btnText}
          href={LANGUAGE_ROUTE(lang, CREATE_MULTIPLAYER_GAME_ROUTE)}
          Icon={Plus}
          variant="secondary"
        >
            <div className="text-sm text-foreground-muted">
                {t.beforeGame.online.createGame.extraDescription}
            </div>    
        </GameModeCard>

        <GameModeCard
          title={t.beforeGame.online.searchGame.title}
          subTxt=""
          btnTxt="asdsad"
          Icon={Search}
          variant="accent"
        >
          <NotificationBanner text="Work in Progress ..." colorVariant="warning">

          </NotificationBanner>
        </GameModeCard>                
      </div>



    </PageBase>
  )
}