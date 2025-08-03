"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import Title from "@/components/ui/text/Title";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";

export default function SoloPage() {

  const { getOrCreateGuestAuthSession } = useAuth();

    async function onSubmit(data: CreateGameSchema) {
      const session = await getOrCreateGuestAuthSession();
      console.log(session);

        console.log("when valid i should see this " + data);
        console.log(data);
    }

  return (
    <PageBase size="sm" backHref={PICK_GAME_MODE_ROUTE}>
      <PageIntro title="Solo Game" subText="Start a new game on your own">

      </PageIntro>

      <Card>
        <div>
          <Title
            title="Game Settings"
            size="sm"
            color="text"
          />
          <SubText text="Customize your game" />          
        </div>

        <CreateGameForm
          onSubmit={onSubmit}
        />
        
      </Card>
    </PageBase>
  )
}