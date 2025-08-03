"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/card/Card";
import Icon from "@/components/ui/Icon";
import SubText from "@/components/ui/text/SubText";
import Title from "@/components/ui/text/Title";
import { Play } from "lucide-react";
import { PICK_GAME_MODE_ROUTE } from "../routes";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";

export default function SoloPage() {
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

        <CreateGameForm />
        
      </Card>

      <Button variant="primary">
        <div className="flex items-center gap-1">
            <Icon LucideIcon={Play} size="sm" /> Start Game
        </div>
      </Button>

    </PageBase>
  )
}