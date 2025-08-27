"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import GameModeCard from "@/features/game/components/GameModeCard";
import { Gamepad, Plus } from "lucide-react";
import { CREATE_MULTIPLAYER_GAME_ROUTE, JOIN_GAME_ROUTE, PICK_GAME_MODE_ROUTE, SOLO_GAME_ROUTE } from "../../routes";
import TextInput from "@/components/ui/form/TextInput";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { GAME_ID_LENGTH, isValidGameId } from "@/features/game/util/game-id-generator";
import { useRouter } from "next/navigation";

export default function OnlinePage() {  
  const router = useRouter();
  const [isValidJoinCode, setIsValidJoinCode] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>("");


  async function onJoinGame() {
    if (!isValidJoinCode) return;
    router.push(JOIN_GAME_ROUTE(joinCode));
  }

  useEffect(() => {
    const isValid = isValidGameId(joinCode);
    setIsValidJoinCode(isValid);
  }, [joinCode]);

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
                value={joinCode}
                label="Game ID"
                className="w-full"
                placeholder="Enter game ID..."
                maxLength={GAME_ID_LENGTH}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <Button className="w-full" variant="secondary" disable={!isValidJoinCode} onClick={onJoinGame}>Join Game</Button>          
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