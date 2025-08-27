"use client"

import { APP_NAME } from "@/app/global-constants"
import HeroBlock from "../ui/block/HeroBlock"
import WordsPlayingBlock from "../general/WordsPlayingBlock"
import WordCountPerLanguageBlock from "../general/WordCountPerLanguageBlock"
import { SupportedLanguage } from "@/features/i18n/languages"
import PageBase from "../layout/PageBase"
import HomePageTranslations from "@/features/i18n/translation-file-interfaces/HomePageTranslations"

interface Props {
    t: HomePageTranslations;
    lang: SupportedLanguage;
}

export default function ClientHome({ t, lang }: Props) {
    return (
        <PageBase requiresAuh={false}>
            <div className="flex flex-col gap-16 items-center pt-20 px-4 text-center">
                <HeroBlock title={APP_NAME}>
                    <div className="space-y-2">
                        <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            {t.intro.sloganPre}
                            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"> {t.intro.sloganPost}</span>
                        </p>
                        <p className="text-lg md:text-xl text-foreground-muted font-medium">
                            {t.intro.teaserPre} <span className="line-through opacity-60">{t.intro.teaserStripedThrough}</span> 
                            <span className="text-success font-bold"> {t.intro.teaserActual}</span>
                        </p>
                    </div>
                </HeroBlock>

                <div className="flex justify-center">
                    {/* <Button variant="primaryFade" size="lg" href={route(PICK_GAME_MODE_ROUTE)}>
                        <span className="">
                            {t?.home.intro.playButton}
                        </span>
                    </Button>                     */}
                </div>

                <WordsPlayingBlock words={t.words ?? []} />

                <WordCountPerLanguageBlock lang={lang} />
            </div>        
        </PageBase>
    )
}