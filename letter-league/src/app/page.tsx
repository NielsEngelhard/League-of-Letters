"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { User, Users } from "lucide-react";
import { MULTIPLAYER_GAME_ROUTE, SOLO_GAME_ROUTE } from "./routes";

export default function HomePage() {
  return (
    <PageBase>
      <PageIntro
        title="Letter-League"
        subText="A cheeky game of wordplay"
        titleColor="gradient"
        titleSize="lg">
      </PageIntro>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <GameModeCard
          title="Solo Mode"
          subTxt="Play a peacefull game at your own pace"
          btnTxt="Play Solo"
          href={SOLO_GAME_ROUTE}
          Icon={User}
          variant="primaryGradient"
        />
        
        <GameModeCard
          title="Multiplayer"
          subTxt="Prove you’re the sharpest mind in the room" 
          btnTxt="Play Online"
          href={MULTIPLAYER_GAME_ROUTE}
          Icon={Users}
          variant="secondaryGradient"
        />        
      </div>

      <div className="text-center text-sm text-foreground-muted">
        Choose a game mode. Do you want to play with other players, or alone?
      </div>

    </PageBase>
  )
}