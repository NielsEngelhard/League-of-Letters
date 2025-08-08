"use server"

import { CreateGameLobbySchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { DbAuthSession, DbOnlineLobby, OnlineLobbyTable } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { GameMapper, JoinGameResponseFactory } from "../../game-mapper";
import { JoinGameLobbyResponse } from "./join-online-game-command";


export default async function CreateGameLobbyCommand(command: CreateGameLobbySchema, secretKey: string): Promise<JoinGameLobbyResponse> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");

    // CHEKC EXISTING GAME
    const existingLobby = await GetExistingLobbyIfExists(authSession);
    
    if (existingLobby) {
        return ReJoinExistingLobby(existingLobby, authSession);
    }

    return await CreateNewGame(authSession);
}

async function ReJoinExistingLobby(existingLobby: DbOnlineLobby, authSession: DbAuthSession): Promise<JoinGameLobbyResponse> {
    return JoinGameResponseFactory.success(existingLobby.id, existingLobby.players.map(p => GameMapper.DbOnlineLobbyPlayerToModel(p)));
}

async function CreateNewGame(authSession: DbAuthSession): Promise<JoinGameLobbyResponse> {
    const gameId = generateGameId();

    const lobby = await db.transaction(async (tx) => {
        return await tx.insert(OnlineLobbyTable).values({
            id: gameId,
            userHostId: authSession.id,
            players: [ GameMapper.AuthSessionToLobbyPlayer(authSession) ]            
        }).returning();
    });

    return JoinGameResponseFactory.success(gameId, lobby[0].players.map(p => GameMapper.DbOnlineLobbyPlayerToModel(p)));
}

async function GetExistingLobbyIfExists(authSession: DbAuthSession): Promise<DbOnlineLobby | undefined> {
    const lobby = await db.query.OnlineLobbyTable.findFirst({
        where: (l, { eq }) => eq(l.userHostId, authSession.id)
    });
    
    return lobby;
}