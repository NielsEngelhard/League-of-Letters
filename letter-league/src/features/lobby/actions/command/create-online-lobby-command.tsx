"use server"

import { CreateOnlineLobbySchema } from "../../lobby-schemas";
import { OnlineLobbyModel } from "../../lobby-models";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { OnlineLobbyMapper } from "../../lobby-mapper";
import { generateGameId } from "@/features/game/util/game-id-generator";
import { DbAuthSession, DbOnlineLobbyPlayer, DbOnlineLobbyWithPlayers, OnlineLobbyPlayerTable, OnlineLobbyTable } from "@/drizzle/schema";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { db } from "@/drizzle/db";


export default async function CreateOnlineLobbyCommand(command: CreateOnlineLobbySchema, secretKey: string): Promise<ServerResponse<OnlineLobbyModel>> {
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

async function ReJoinExistingLobby(existingLobby: DbOnlineLobbyWithPlayers, authSession: DbAuthSession): Promise<ServerResponse<OnlineLobbyModel>> {
    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(existingLobby);

    return ServerResponseFactory.success<OnlineLobbyModel>(lobbyModel);    
}

async function CreateNewGame(authSession: DbAuthSession): Promise<ServerResponse<OnlineLobbyModel>> {
    const gameId = generateGameId();    

    const lobby = await db.transaction(async (tx) => {
        const lobby = await tx.insert(OnlineLobbyTable).values({
            id: gameId,
            userHostId: authSession.id,
        }).returning();

        const hostLobbyPlayer: DbOnlineLobbyPlayer = OnlineLobbyMapper.AuthSessionToLobbyPlayer(authSession, gameId);

        const lobbyPlayers = await tx.insert(OnlineLobbyPlayerTable)
            .values(hostLobbyPlayer)
            .returning(); 

        return {
            ...lobby[0],
            players: lobbyPlayers
        } as DbOnlineLobbyWithPlayers;
    });

    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(lobby);

    return ServerResponseFactory.success<OnlineLobbyModel>(lobbyModel);
}

async function GetExistingLobbyIfExists(authSession: DbAuthSession): Promise<DbOnlineLobbyWithPlayers | undefined> {
    const lobby = await db.query.OnlineLobbyTable.findFirst({
        where: (l, { eq }) => eq(l.userHostId, authSession.id),
        with: {
            players: true
        }
    });
    
    return lobby;
}