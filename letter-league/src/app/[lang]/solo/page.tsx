import PageBase from "@/components/layout/PageBase";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import { LANGUAGE_ROUTE, PICK_GAME_MODE_ROUTE } from "@/app/routes";
import PageIntro from "@/components/ui/block/PageIntro";

export default async function SoloPage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["beforeGame"]);

  return (
    <PageBase size="sm" lang={lang}>
  
      <PageIntro title={t.beforeGame.gameMode.solo.title} subText={t.beforeGame.gameMode.solo.description} backHref={LANGUAGE_ROUTE(lang, PICK_GAME_MODE_ROUTE)}>

      </PageIntro>

      <Card>
        <CardHeader>
          <CardTitle>{t.beforeGame.createGameForm.title}</CardTitle>
          <SubText text={t.beforeGame.createGameForm.description} /> 
        </CardHeader>
        <CardContent>          
          <CreateGameForm
            gameMode="solo"
            lang={lang}
            t={t.beforeGame}
          />          
        </CardContent>
      </Card>
    </PageBase>
  )
}