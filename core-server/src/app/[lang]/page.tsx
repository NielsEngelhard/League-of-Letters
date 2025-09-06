"use server"

import { loadTranslations } from "@/features/i18n/utils";
import { SupportedLanguage } from "@/features/i18n/languages";
import PageBase from "@/components/layout/PageBase";
import HeroBlock from "@/components/ui/block/HeroBlock";
import { APP_NAME } from "../global-constants";
import WordsPlayingBlock from "@/components/general/WordsPlayingBlock";
import WordCountPerLanguageBlock from "@/components/general/WordCountPerLanguageBlock";
import PlayNowCtaButton from "@/components/general/PlayNowCtaButton";
import { GetCurrentUser_Server } from "@/features/auth/current-user";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["home"]);

  const currentUser = await GetCurrentUser_Server();

  return (
    <PageBase requiresAuh={false} lang={lang}>
        <div className="flex flex-col gap-16 items-center pt-20 px-4 text-center">
            <HeroBlock title={APP_NAME}>
                <div className="space-y-2">
                    <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        {t.home.intro.sloganPre}
                        <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"> {t.home.intro.sloganPost}</span>
                    </p>
                    <p className="text-lg md:text-xl text-foreground-muted font-medium">
                        {t.home.intro.teaserPre} <span className="line-through opacity-60">{t.home.intro.teaserStripedThrough}</span> 
                        <span className="text-success font-bold"> {t.home.intro.teaserActual}</span>
                    </p>
                </div>
            </HeroBlock>

            <div className="flex justify-center">
                <PlayNowCtaButton
                    lang={lang}
                    userIsAuthenticated={currentUser != null}
                    label={t?.home.intro.playButton}
                />                 
            </div>

            <WordsPlayingBlock words={t.home.words ?? []} />

            <WordCountPerLanguageBlock lang={lang} />
        </div>      
    </PageBase>
  );
}
