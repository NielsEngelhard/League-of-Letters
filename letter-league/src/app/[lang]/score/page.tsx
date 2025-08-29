import { SupportedLanguage } from "@/features/i18n/languages";
import { loadTranslations } from "@/features/i18n/utils";
import ScoreBlock from "@/features/score/ScoreBlock";

export default async function ScorePage({ params }: { params: Promise<{ lang: SupportedLanguage }> }) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["score"]);

    return (
        <ScoreBlock t={t.score} />
    )
}