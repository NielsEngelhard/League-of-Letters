import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import ScoreBlock from "@/features/score/ScoreBlock";

export default async function ScorePage({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["score"]);

    return (
        <PageBase lang={lang} requiresAuh={false}>
        <PageIntro
          title={t.score.title}
          subText={t.score.description}
          titleColor="gradient"
          titleSize="lg">
        </PageIntro> 

          <ScoreBlock t={t.score} />
        </PageBase>
    )
}