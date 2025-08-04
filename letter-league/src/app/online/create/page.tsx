"use client"

import PageBase from "@/components/layout/PageBase";
import PageIntro from "@/components/ui/block/PageIntro";
import Card from "@/components/ui/card/Card";
import SubText from "@/components/ui/text/SubText";
import Title from "@/components/ui/text/Title";
import CreateGameForm from "@/features/game/components/form/CreateGameForm";
import { CreateGameSchema } from "@/features/game/game-schemas";
import { useAuth } from "@/features/auth/AuthContext";
import CreateGameCommand from "@/features/game/actions/command/create-game-command";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { AuthSessionModel } from "@/features/auth/auth-models";
import { PICK_GAME_MODE_ROUTE } from "@/app/routes";

export default function CreateOnlineGamePage() {
  const router = useRouter()
  const { getOrCreateGuestAuthSession } = useAuth();
  const [authSession, setAuthSession] = useState<AuthSessionModel | null>(null);

  useEffect(() => {
    getOrCreateGuestAuthSession()
    .then((response) => {
        setAuthSession(response);
    })
    .catch(() => {
        router.push(PICK_GAME_MODE_ROUTE);
    });
  });

    async function onSubmit(data: CreateGameSchema) {
      

    }

  return (
    <PageBase size="lg">
      <PageIntro title="Create Online Game" subText="Join Code:" backHref={PICK_GAME_MODE_ROUTE}>
        <div className="text-3xl font-bold">
          ABC-DEF
        </div>
      </PageIntro>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
            <Card className="col-span-2">
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
            <Card className="col-span-1">
                <div>
                    lobby players    
                </div>    
            </Card>     
        </div>
    </PageBase>
  )
}