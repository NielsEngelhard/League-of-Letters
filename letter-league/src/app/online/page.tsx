"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { Gamepad, Plus } from "lucide-react";
import { CREATE_MULTIPLAYER_GAME_ROUTE, PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "../routes";
import TextInput from "@/components/ui/form/TextInput";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function OnlinePage() {  
  const [isValidJoinCode, setIsValidJoinCode] = useState<boolean>(false);


  function onJoinGame() {
    // TODO: hier morgen verder
  }

  return (
    <PageBase>
      <PageIntro title="Online Game" subText="Play with other people" backHref={PICK_GAME_MODE_ROUTE}>

      </PageIntro>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        <GameModeCard
          title="Join Game"
          subTxt="Enter a game ID to join an existing match"
          btnTxt="Join Game"
          Icon={Gamepad}
          variant="secondary"
        >
          <>
            <TextInput
                label="Game ID"
                className="w-full"
                placeholder="Enter game ID..."
            />
            <Button className="w-full" variant="secondary" disabled={true}>Join Game</Button>          
          </>
        </GameModeCard>
        
        <GameModeCard
          title="Create Game"
          subTxt="Start a new game and invite friends / (or foes)"
          btnTxt="Play Online"
          href={CREATE_MULTIPLAYER_GAME_ROUTE}
          Icon={Plus}
          variant="accent"
        >
            <div className="text-sm text-foreground-muted">
                Create a lobby and share the game ID with friends
            </div>    
        </GameModeCard>        
      </div>

      <div className="text-center text-sm text-foreground-muted">
        Join a game with a code, or create a new one.
      </div>

    </PageBase>
  )
}