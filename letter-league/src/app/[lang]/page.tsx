"use client"

import PageBase from "@/components/layout/PageBase"
import { APP_NAME } from "../global-constants"
import Button from "@/components/ui/Button";
import HeroBlock from "@/components/ui/block/HeroBlock";
import WhatIsBlock from "@/components/general/WhatIsBlock";
import WordsPlayingBlock from "@/components/general/WordsPlayingBlock";
import WordCountPerLanguageBlock from "@/components/general/WordCountPerLanguageBlock";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import { useRouteToPage } from "../useRouteToPage";
import { SupportedLanguage } from "@/features/i18n/languages";
import { use } from "react";
import { useTranslations } from "@/features/i18n/useTranslations";

export default function HomePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {    
    const { lang } = use(params);
    const { t, loading } = useTranslations(lang);
    const route = useRouteToPage();

    return (
        <PageBase requiresAuh={false} isLoadingPage={loading}>
            <div className="flex flex-col gap-16 items-center pt-20 px-4 text-center">
                <HeroBlock title={APP_NAME}>
                    <div className="space-y-2">
                        <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            {t?.home.intro.sloganPre}
                            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"> {t?.home.intro.sloganPost}</span>
                        </p>
                        <p className="text-lg md:text-xl text-foreground-muted font-medium">
                            {t?.home.intro.teaserPre} <span className="line-through opacity-60">{t?.home.intro.teaserStripedThrough}</span> 
                            <span className="text-success font-bold"> {t?.home.intro.teaserActual}</span>
                        </p>
                    </div>
                </HeroBlock>

                <div className="flex justify-center">
                    <Button variant="primaryFade" size="lg" href={route(PICK_GAME_MODE_ROUTE)}>
                        <span className="">
                            {t?.home.intro.playButton}
                        </span>
                    </Button>                    
                </div>

                <WordsPlayingBlock words={t?.home.words ?? []} />

                <WordCountPerLanguageBlock />

                {/* <WhatIsBlock />                 */}
            </div>
        </PageBase>
    )
}