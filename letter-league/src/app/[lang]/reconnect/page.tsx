"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import { MULTIPLAYER_GAME_ROUTE } from "../../routes";
import ReconnectGamesOverview from "@/features/game/components/ReconnectGamesOverview";
import { useRouteToPage } from "@/app/useRouteToPage";

export default function ReconnectPage() {
  const route = useRouteToPage();

  return (
    <PageBase size="md">
  
        <PageIntro title="Reconnect" subText="Overview of your active games" backHref={route(MULTIPLAYER_GAME_ROUTE)}>

        </PageIntro>

        <ReconnectGamesOverview />
    </PageBase>
  )
}