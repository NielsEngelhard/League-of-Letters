"use server"

import { JoinGameLobbySchema } from "../../game-schemas";
import { db } from "@/drizzle/db";
import { DbOnlineLobby, OnlineLobbyTable, DbOnlineLobbyPlayer, DbAuthSession } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { MAX_ONLINE_GAME_PLAYERS } from "../../game-constants";
import { GameMapper } from "../../game-mapper";
import { eq } from "drizzle-orm";
import { GameLobbyModel, GamePlayerModel } from "../../game-models";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";

export default async function JoinGameLobbyCommand(command: JoinGameLobbySchema, secretKey: string): Promise<ServerResponse<GameLobbyModel | null>> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");
    
    const lobby = await GetGameLobby(command.gameId);
    if (!lobby) {
        return ServerResponseFactory.error(`Lobby with '${command.gameId}' does not exist`);
    }
    
    if (lobby.players.some(p => p.id == authSession.id)) {
        lobby.players = await ReconnectPlayer(lobby, authSession);
    } else {
        if (lobby.players.length >= MAX_ONLINE_GAME_PLAYERS) {
            return ServerResponseFactory.error(`Game is full`);
        }

        lobby.players = await CreateNewPlayer(lobby, authSession);
    }

    const lobbyModel = GameMapper.DbLobbyToModel(lobby);

    return ServerResponseFactory.success(lobbyModel);
}

async function CreateNewPlayer(lobby: DbOnlineLobby, authSession: DbAuthSession): Promise<DbOnlineLobbyPlayer[]> {
    const player: DbOnlineLobbyPlayer = GameMapper.AuthSessionToLobbyPlayer(authSession);
    const updatedPlayers: DbOnlineLobbyPlayer[] = [...lobby.players, player];

    await db.update(OnlineLobbyTable)
        .set({
            players: updatedPlayers
        })
        .where(eq(OnlineLobbyTable.id, lobby.id));     
        
    return updatedPlayers;
}

async function ReconnectPlayer(lobby: DbOnlineLobby, authSession: DbAuthSession): Promise<DbOnlineLobbyPlayer[]> {
    const updatedPlayers: DbOnlineLobbyPlayer[] = lobby.players.map(p => {
        if (p.id === authSession.id) {
            return { ...p, connectionStatus: "connected" }; // updated player
        }
        return p;
    });

    await db.update(OnlineLobbyTable)
        .set({
            players: updatedPlayers
        })
        .where(eq(OnlineLobbyTable.id, lobby.id));     
        
    return updatedPlayers;
}

async function GetGameLobby(gameId: string): Promise<DbOnlineLobby | undefined> {
    const gameLobby = await db.query.OnlineLobbyTable.findFirst({
        where: (lobby, { eq }) => eq(lobby.id, gameId)
    });

    return gameLobby;
}
