"use server"

import GetOnlineLobbyAndPlayersByIdRequest from "../query/get-lobby-and-players-by-id-command";
import { CreateGameSchema } from "@/features/game/game-schemas";
import CreateGameCommand from "@/features/game/actions/command/create-game-command";
import { db } from "@/drizzle/db";
import DeleteOnlineLobbyById from "./delete-online-lobby";
import { EmitStartGameRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { DbOnlineLobbyPlayer } from "@/drizzle/schema";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { getCurrentUtcDate, getCurrentUtcDatePlusSeconds } from "@/lib/time-util";

export default async function CreateOnlineGameBasedOnLobbyCommand(schema: CreateGameSchema): Promise<void> {
    const currentUser = await AuthenticateOrRedirect_Server();       

    const lobby = await GetOnlineLobbyAndPlayersByIdRequest(schema.gameId!);
    if (lobby?.hostAccountId != currentUser.accountId) {
        throw new Error("AUTH ERROR: only the host can start this game");
    }
    
    AddPlayersToCreateSchema(schema, lobby.players);

    const gameId = await db.transaction(async (tx) => {
        const gameId = await CreateGameCommand(schema, lobby.id);
        await DeleteOnlineLobbyById(lobby.id, tx);

        return gameId;
    });

    const guessEndDateTime: Date | undefined = schema.nSecondsPerGuess
        ? getCurrentUtcDatePlusSeconds(schema.nSecondsPerGuess) // Current utc date + seconds per guess
        : undefined

    await EmitStartGameRealtimeEvent({
        gameId: gameId,
        withTimer: Boolean(schema.nSecondsPerGuess && schema.gameMode == "online"),
        guessEndDateTime: guessEndDateTime
    });
}

function AddPlayersToCreateSchema(schema: CreateGameSchema, lobbyPlayers: DbOnlineLobbyPlayer[]) {
    schema.players = lobbyPlayers.map(p => {
        return {
            accountId: p.accountId,
            username: p.username,
            connectionStatus: p.connectionStatus,
            colorHex: p.colorHex ?? "#3B82F6"
        }
    });
}