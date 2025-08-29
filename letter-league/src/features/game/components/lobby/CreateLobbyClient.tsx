"use client"

import CreateGameForm from "../form/CreateGameForm"
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import { useActiveGame } from "../active-game-context";
import { useEffect } from "react";
import { useSocket } from "@/features/realtime/socket-context";
import { SupportedLanguage } from "@/features/i18n/languages";
import BeforeGameTranslations from "@/features/i18n/translation-file-interfaces/BeforeGameTranslations";
import { useMessageBar } from "@/components/layout/MessageBarContext";
import { useAuth } from "@/features/auth/AuthContext";

interface Props {
  lang: SupportedLanguage;
  initialLobby: OnlineLobbyModel;
  t: BeforeGameTranslations;  
}

export default function CreateLobbyClient({ initialLobby, lang, t }: Props) {
    const { players, setInitialPlayers, clearGameState, game } = useActiveGame();
    const { initializeConnection, emitJoinGame, connectionStatus } = useSocket();
    const { pushSuccessMsg, pushLoadingMsg } = useMessageBar();
    const { account } = useAuth();

    // Clear game state when discarding the client
    useEffect(() => {
        return () => {
            clearGameState();
        }
    }, []);

    // Initialize game
    useEffect(() => {
      if (!account) return;

      setInitialPlayers(initialLobby.players);
    }, [account]);

    // When lobby set, initialize realtime connection
    useEffect(() => {
      if (!players || players.length < 1 || connectionStatus == "connected") return;
      pushLoadingMsg("Connecting with the realtime server");
      initializeConnection();
    }, [players]);

    // Handle realtime connection connected
    useEffect(() => {
        if (connectionStatus != "connected" || !account) return; 

        emitJoinGame({
            gameId: initialLobby.id,
            accountId: account.id,
            username: account.username,
            isHost: false
        });

        pushSuccessMsg("Connected");
    }, [connectionStatus]);    

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