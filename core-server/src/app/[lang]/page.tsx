"use server"

import { loadTranslations } from "@/features/i18n/utils";
import { SupportedLanguage } from "@/features/i18n/languages";
import PageBase from "@/components/layout/PageBase";
import HeroBlock from "@/components/ui/block/HeroBlock";
import { APP_NAME } from "../global-constants";
import WordsPlayingBlock from "@/components/general/WordsPlayingBlock";
import WordCountPerLanguageBlock from "@/components/general/WordCountPerLanguageBlock";
import PlayNowCtaButton from "@/components/general/PlayNowCtaButton";
import { Authenticate_Server } from "@/features/auth/current-user";
import NotificationBanner from "@/components/ui/NotificationBanner";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  const t = await loadTranslations(lang, ["home"]);

  const currentUser = await Authenticate_Server(true);

  return (
    <PageBase requiresAuh={false} lang={lang}>
      <NotificationBanner
        text={t.home.disclaimer}
        colorVariant="warning"        
      />

        <div className="flex flex-col gap-16 items-center pt-10 md:pt-20 px-4 text-center">
        <HeroBlock title={APP_NAME}>
            <div className="relative">
                {/* Minecraft-style tilted message */}
                <div className="absolute -top-30 -right-4 transform rotate-10 z-10">
                    <div className="bg-secondary/90 text-background px-3 py-1 rounded-md shadow-lg font-bold text-sm whitespace-nowrap z-20 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out">
                        ✨ {t.home.smallAnnouncement}
                    </div>
                </div>
                
                <div className="space-y-2">
                    <p className="text-lg md:text-2xl text-foreground font-bold">
                        {t.home.intro.teaserPre} <span className="line-through opacity-60">{t.home.intro.teaserStripedThrough}</span> 
                        <span className="text-success font-bold"> {t.home.intro.teaserActual}</span>
                    </p>
                </div>
            </div>
        </HeroBlock>

            <div className="flex justify-center">
                <PlayNowCtaButton
                    lang={lang}
                    userIsAuthenticated={currentUser != null}
                    label={t?.home.intro.playButton}
                />                 
            </div>

            <WordsPlayingBlock actualWord={t.home.playingGuessGrid.actualWord} guesses={t.home.playingGuessGrid.guesses}  />

            <WordCountPerLanguageBlock lang={lang} />
        </div>      
    </PageBase>
  );
}
