"use server"

import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import GetOnlineLobbyAndPlayersByIdRequest from "../query/get-lobby-and-players-by-id-command";
import { CreateGameSchema } from "@/features/game/game-schemas";
import CreateGameCommand from "@/features/game/actions/command/create-game-command";
import { OnlineLobbyPlayerModel } from "../../lobby-models";
import { db } from "@/drizzle/db";
import DeleteOnlineLobbyById from "./delete-online-lobby";
import { EmitStartGameRealtimeEvent } from "@/features/realtime/realtime-api-adapter";

export default async function CreateOnlineGameBasedOnLobbyCommand(schema: CreateGameSchema, secretKey: string): Promise<void> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");    
    

    const lobby = await GetOnlineLobbyAndPlayersByIdRequest(schema.gameId!);
    if (lobby?.userHostId != authSession.id) {
        throw new Error("AUTH ERROR: only the host can start this game");
    }
    
    AddPlayersToCreateSchema(schema, lobby.players);

    await db.transaction(async (tx) => {
        await CreateGameCommand(schema, secretKey, lobby.id, tx);
        await DeleteOnlineLobbyById(lobby.id, tx);
    });

    await EmitStartGameRealtimeEvent(schema.gameId!);
}

function AddPlayersToCreateSchema(schema: CreateGameSchema, lobbyPlayers: OnlineLobbyPlayerModel[]) {
    schema.players = lobbyPlayers.map(p => {
        return {
            userId: p.userId,
            username: p.username
        }
    });
}