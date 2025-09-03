"use server"

import GetOnlineLobbyAndPlayersByIdRequest from "../query/get-lobby-and-players-by-id-command";
import { CreateGameSchema } from "@/features/game/game-schemas";
import CreateGameCommand from "@/features/game/actions/command/create-game-command";
import { db } from "@/drizzle/db";
import DeleteOnlineLobbyById from "./delete-online-lobby";
import { EmitStartGameRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { DbOnlineLobbyPlayer } from "@/drizzle/schema";
import { getCurrentUserOrRedirect } from "@/features/auth/current-user";

export default async function CreateOnlineGameBasedOnLobbyCommand(schema: CreateGameSchema): Promise<void> {
    const currentUser = await getCurrentUserOrRedirect();       

    const lobby = await GetOnlineLobbyAndPlayersByIdRequest(schema.gameId!);
    if (lobby?.hostAccountId != currentUser.accountId) {
        throw new Error("AUTH ERROR: only the host can start this game");
    }
    
    AddPlayersToCreateSchema(schema, lobby.players);

    await db.transaction(async (tx) => {
        await CreateGameCommand(schema, lobby.id);
        await DeleteOnlineLobbyById(lobby.id, tx);
    });

    await EmitStartGameRealtimeEvent(schema.gameId!);
}

function AddPlayersToCreateSchema(schema: CreateGameSchema, lobbyPlayers: DbOnlineLobbyPlayer[]) {
    schema.players = lobbyPlayers.map(p => {
        return {
            accountId: p.accountId,
            username: p.username,
            connectionStatus: p.connectionStatus
        }
    });
}