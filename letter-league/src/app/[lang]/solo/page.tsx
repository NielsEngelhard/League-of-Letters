"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import { PICK_GAME_MODE_ROUTE, PLAY_GAME_ROUTE } from "../../routes";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import CreateGameCommand from "@/features/game/actions/command/create-game-command";
import { useRouter } from 'next/navigation'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card/card-children";
import { useRouteToPage } from "@/app/useRouteToPage";

export default function SoloPage() {
  const router = useRouter()
  const route = useRouteToPage();

    async function onSubmit(data: CreateGameSchema) {
      CreateGameCommand(data)
      .then((gameId) => {
        router.push(route(PLAY_GAME_ROUTE(gameId)));
      });
    }

  return (
    <PageBase size="sm">
  
      <PageIntro title="Solo Game" subText="Start a new game on your own" backHref={route(PICK_GAME_MODE_ROUTE)}>

      </PageIntro>

      <Card>
        <CardHeader>
          <CardTitle>Game Settings</CardTitle>
          <SubText text="Customize your game" /> 
        </CardHeader>
        <CardContent>          
          <CreateGameForm
            onSubmit={onSubmit}
            gameMode="solo"
          />          
        </CardContent>
      </Card>
    </PageBase>
  )
}