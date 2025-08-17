"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import { MULTIPLAYER_GAME_ROUTE } from "../routes";
import ReconnectGamesOverview from "@/features/game/components/ReconnectGamesOverview";

export default function ReconnectPage() {

  return (
    <PageBase size="md">
  
        <PageIntro title="Reconnect" subText="Overview of your active games" backHref={MULTIPLAYER_GAME_ROUTE}>

        </PageIntro>

        <ReconnectGamesOverview />
    </PageBase>
  )
}