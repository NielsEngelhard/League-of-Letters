"use client"

import { OptionItem, OptionsMenu } from "@/components/ui/OptionsMenu";
import DeleteOnlineLobbyById from "@/features/lobby/actions/command/delete-online-lobby";

interface Props {
    lobbyId: string;
}

export default function LobbyOptions({lobbyId}: Props) {
    async function abandonLobby() {
        if (!lobbyId) return;
        await DeleteOnlineLobbyById(lobbyId, undefined, true);
    }

    const lobbyOptions: OptionItem[] = [
        {
        label: "Abandon",
        onClick: abandonLobby,
        destructive: true
        }
    ];

    return (
        <OptionsMenu
            options={lobbyOptions}
        />
    )
}