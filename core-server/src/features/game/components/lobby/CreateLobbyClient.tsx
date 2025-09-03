"use client"

import CreateGameForm from "../form/CreateGameForm"
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import { useActiveGame } from "../active-game-context";
import { useEffect } from "react";
import { useSocket } from "@/features/realtime/socket-context";
import { SupportedLanguage } from "@/features/i18n/languages";
import BeforeGameTranslations from "@/features/i18n/translation-file-interfaces/BeforeGameTranslations";
import { redirect } from "next/navigation";
import { LANGUAGE_ROUTE, MULTIPLAYER_GAME_ROUTE } from "@/app/routes";

interface Props {
  lang: SupportedLanguage;
  initialLobby: OnlineLobbyModel;
  t: BeforeGameTranslations;
  accountId: string;
  username: string;
}

export default function CreateLobbyClient({ initialLobby, lang, t, accountId, username }: Props) {
    const { players, setInitialPlayers } = useActiveGame();
    const { emitJoinGame, connectionStatus } = useSocket();

    // Join the websocket room
    useEffect(() => {
        if (connectionStatus != "connected" || !initialLobby || !accountId) {
          redirect(LANGUAGE_ROUTE(lang, MULTIPLAYER_GAME_ROUTE));
        }; 

        setInitialPlayers(initialLobby.players);

        emitJoinGame({
            gameId: initialLobby.id,
            accountId: accountId,
            username: username,
            isHost: false
        });
    }, []);    

    return (
      <CreateGameForm
        lang={lang}
        t={t}
        gameId={initialLobby.id}
        gameMode="online" 
        players={players.map((p) => ({ accountId: p.accountId, username: p.username }))}
      />
    )
}