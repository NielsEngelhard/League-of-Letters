"use server"

import { OnlineLobbyModel } from "../../lobby-models";
import { OnlineLobbyMapper } from "../../lobby-mapper";
import { generateGameId } from "@/features/game/util/game-id-generator";
import { DbOnlineLobbyPlayer, DbOnlineLobbyWithPlayers, OnlineLobbyPlayerTable, OnlineLobbyTable } from "@/drizzle/schema";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { db } from "@/drizzle/db";
import { CurrentUserData, getCurrentUserOrCrash } from "@/features/auth/current-user";


export default async function CreateOnlineLobbyCommand(): Promise<ServerResponse<OnlineLobbyModel>> {
    const currentUser = await getCurrentUserOrCrash();

    // CHECK EXISTING GAME
    const existingLobby = await GetExistingLobbyIfExists(currentUser);

    if (existingLobby) {
        return ReJoinExistingLobby(existingLobby);
    }

    return await CreateNewGame(currentUser);
}

async function ReJoinExistingLobby(existingLobby: DbOnlineLobbyWithPlayers): Promise<ServerResponse<OnlineLobbyModel>> {
    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(existingLobby);
    return ServerResponseFactory.success<OnlineLobbyModel>(lobbyModel);    
}

async function CreateNewGame(currentUser: CurrentUserData): Promise<ServerResponse<OnlineLobbyModel>> {
    const gameId = generateGameId();    

    const lobby = await db.transaction(async (tx) => {
        const lobby = await tx.insert(OnlineLobbyTable).values({
            id: gameId,
            hostAccountId: currentUser.accountId,
            language: currentUser.language
        }).returning();

        const hostLobbyPlayer: DbOnlineLobbyPlayer = OnlineLobbyMapper.CurrentUserToLobbyPlayer(currentUser, gameId);

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

async function GetExistingLobbyIfExists(currentUser: CurrentUserData): Promise<DbOnlineLobbyWithPlayers | undefined> {
    const lobby = await db.query.OnlineLobbyTable.findFirst({
        where: (l, { eq }) => eq(l.hostAccountId, currentUser.accountId),
        with: {
            players: true
        }
    });
    
    return lobby;
}