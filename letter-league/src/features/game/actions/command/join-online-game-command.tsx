"use server"

import { JoinGameLobbySchema } from "../../game-schemas";
import { db } from "@/drizzle/db";
import { DbOnlineLobby, OnlineLobbyTable, DbOnlineLobbyPlayer, DbAuthSession } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { MAX_ONLINE_GAME_PLAYERS } from "../../game-constants";
import { GameMapper, JoinGameResponseFactory } from "../../game-mapper";
import { eq } from "drizzle-orm";
import { GamePlayerModel } from "../../game-models";

export interface JoinGameLobbyResponse {
    ok: boolean;    
    errorMsg?: string;

    players: GamePlayerModel[];
    gameId: string;
}

export default async function JoinGameLobbyCommand(command: JoinGameLobbySchema, secretKey: string): Promise<JoinGameLobbyResponse> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");
    
    const lobby = await GetGameLobby(command.gameId);
    if (!lobby) {
        return JoinGameResponseFactory.error(`Lobby with ${command.gameId} does not exist`);
    }

    let updatedPlayers: DbOnlineLobbyPlayer[] = [];
    if (lobby.players.some(p => p.id == authSession.id)) {
        updatedPlayers = await ReconnectPlayer(lobby, authSession);
    } else {
        if (lobby.players.length >= MAX_ONLINE_GAME_PLAYERS) {
            return JoinGameResponseFactory.error(`Game is full`);
        }

        updatedPlayers = await CreateNewPlayer(lobby, authSession);
    }

    return JoinGameResponseFactory.success(lobby.id, updatedPlayers.map(p => GameMapper.DbOnlineLobbyPlayerToModel(p)));
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
