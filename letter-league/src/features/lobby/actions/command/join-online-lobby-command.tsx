"use server"

import { db } from "@/drizzle/db";
import { DbOnlineLobby, OnlineLobbyTable, DbOnlineLobbyPlayer, DbAuthSession, DbOnlineLobbyWithPlayers, OnlineLobbyPlayerTable } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { MAX_ONLINE_GAME_PLAYERS } from "../../../game/game-constants";
import { eq } from "drizzle-orm";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { JoinOnlineLobbySchema } from "@/features/lobby/lobby-schemas";
import { OnlineLobbyModel } from "@/features/lobby/lobby-models";
import { OnlineLobbyMapper } from "@/features/lobby/lobby-mapper";
import GetOnlineLobbyAndPlayersByIdRequest from "../query/get-lobby-and-players-by-id-command";
import ReconnectOnlineLobbyPlayer from "./reconnect-online-lobby-player";

export default async function JoinGameLobbyCommand(command: JoinOnlineLobbySchema, secretKey: string): Promise<ServerResponse<OnlineLobbyModel | null>> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");
    
    const lobby = await GetOnlineLobbyAndPlayersByIdRequest(command.gameId);
    if (!lobby) {
        return ServerResponseFactory.error(`Lobby with '${command.gameId}' does not exist`);
    }
    
    if (lobby.players.some(p => p.id == authSession.id)) {
        await ReconnectOnlineLobbyPlayer({
            lobbyId: lobby.id,
            userId: authSession.id
        });
    } else {
        if (lobby.players.length >= MAX_ONLINE_GAME_PLAYERS) {
            return ServerResponseFactory.error(`Game is full`);
        }

        const newPlayer = await CreateNewPlayer(lobby, authSession);
        lobby.players.push(newPlayer);
    }

    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(lobby);

    return ServerResponseFactory.success(lobbyModel);
}

async function CreateNewPlayer(lobby: DbOnlineLobby, authSession: DbAuthSession): Promise<DbOnlineLobbyPlayer> {
    const player: DbOnlineLobbyPlayer = OnlineLobbyMapper.AuthSessionToLobbyPlayer(authSession, lobby.id);

    await db.insert(OnlineLobbyPlayerTable)
        .values(player);
        
    return player;
;
}
