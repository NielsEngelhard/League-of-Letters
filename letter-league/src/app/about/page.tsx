"use client"

import PageBase from "@/components/layout/PageBase"
import { APP_NAME } from "../global-constants"
import Card from "@/components/ui/card/Card";
import { CardContent } from "@/components/ui/card/card-children";
import Button from "@/components/ui/Button";
import { supportedLanguages } from "@/features/i18n/languages";
import HeroBlock from "@/components/ui/block/HeroBlock";
import WhatIsBlock from "@/components/general/WhatIsBlock";
import WordsPlayingBlock from "@/components/general/WordsPlayingBlock";
import WordCountPerLanguageBlock from "@/components/general/WordCountPerLanguageBlock";

export default function AboutPage() {
    
    
    return (
        <PageBase requiresAuh={false}>
            <div className="flex flex-col gap-16 items-center pt-20 px-4 text-center">

                <HeroBlock title={APP_NAME}>
                    <div className="space-y-2">
                        <p className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            Come play a cheeky game of 
                            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent"> word play!</span>
                        </p>
                        <p className="text-lg md:text-xl text-foreground-muted font-medium">
                            Ready to <span className="line-through opacity-60">destroy your confidence</span> 
                            <span className="text-success font-bold"> level up your skills?</span>
                        </p>
                    </div>
                </HeroBlock>

                <Button variant="primaryFade" size="lg">
                    <span className="">
                        🎮 Play for Free!
                    </span>
                </Button>

                <WordsPlayingBlock />

                <WhatIsBlock />

                <WordCountPerLanguageBlock />
            </div>
        </PageBase>
    )
}