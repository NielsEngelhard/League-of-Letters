"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { User, Users } from "lucide-react";
import { MULTIPLAYER_GAME_ROUTE, SCORE_ROUTE, SOLO_GAME_ROUTE } from "../../routes";
import ReconnectGamesOverview from "@/features/game/components/ReconnectGamesOverview";
import Link from "next/link";
import { SupportedLanguage } from "@/features/i18n/languages";
import { use } from "react";

export default function HomePage({
  params
}: {
  params: Promise<{ lang: SupportedLanguage }>
}) {
  const { lang } = use(params);

  return (
    <PageBase requiresAuh={false}>
      <PageIntro
        title="Letter-League"
        subText="A cheeky game of wordplay"
        titleColor="gradient"
        titleSize="lg">
      </PageIntro>      
      <span>temp: {lang}</span>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <GameModeCard
          title="Multiplayer"
          subTxt="Prove you’re the sharpest mind in the room" 
          btnTxt="Play Online"
          href={MULTIPLAYER_GAME_ROUTE}
          Icon={Users}
          variant="secondaryGradient"
        />           
        
        <GameModeCard
          title="Solo Mode"
          subTxt="Play a peacefull game at your own pace"
          btnTxt="Play Solo"
          href={SOLO_GAME_ROUTE}
          Icon={User}
          variant="primaryGradient"
        />           
      </div>

      <ReconnectGamesOverview />

      <div className="text-center text-sm text-foreground-muted">
        Curious about how the <span className="font-bold underline">score system</span> works? <Link href={SCORE_ROUTE} className="font-bold underline text-primary">Click here!</Link>
      </div>

    </PageBase>
  )
}