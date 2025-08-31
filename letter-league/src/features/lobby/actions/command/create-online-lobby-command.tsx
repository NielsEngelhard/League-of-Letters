"use server"

import { OnlineLobbyModel } from "../../lobby-models";
import { OnlineLobbyMapper } from "../../lobby-mapper";
import { generateGameId } from "@/features/game/util/game-id-generator";
import { DbOnlineLobbyPlayer, DbOnlineLobbyWithPlayers, OnlineLobbyPlayerTable, OnlineLobbyTable } from "@/drizzle/schema";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { db } from "@/drizzle/db";
import { CurrentUserData, getCurrentUserOrRedirect } from "@/features/auth/current-user";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";


export default async function CreateOnlineLobbyCommand(preDefinedGameId?: string): Promise<ServerResponse<OnlineLobbyModel>> {
    const currentUser = await getCurrentUserOrRedirect();

    // Check if the user already has an existing lobby
    const existingLobby = await GetExistingLobbyForUserIfExists(currentUser);

    if (existingLobby) {
        return ReJoinExistingLobby(existingLobby);
    }

    return await CreateNewGame(currentUser, preDefinedGameId);
}

async function ReJoinExistingLobby(existingLobby: DbOnlineLobbyWithPlayers): Promise<ServerResponse<OnlineLobbyModel>> {
    const lobbyModel = OnlineLobbyMapper.DbLobbyToModel(existingLobby);
    return ServerResponseFactory.success<OnlineLobbyModel>(lobbyModel);    
}

async function CreateNewGame(currentUser: CurrentUserData, preDefinedGameId?: string): Promise<ServerResponse<OnlineLobbyModel>> {
    const gameId = await determineGameId(preDefinedGameId);

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

async function GetExistingLobbyForUserIfExists(currentUser: CurrentUserData): Promise<DbOnlineLobbyWithPlayers | undefined> {
    const lobby = await db.query.OnlineLobbyTable.findFirst({
        where: (l, { eq }) => eq(l.hostAccountId, currentUser.accountId),
        with: {
            players: true
        }
    });
    
    return lobby;
}

async function determineGameId(preDefinedGameId?: string): Promise<string> {
    const gameIdGenerationTries = 5; // Try 5 times, otherwise throw error if id still causes conflicts
    let gameId: string = preDefinedGameId || generateGameId();

    for(let i=0; i<5; i++) {
        const causesConflicts: boolean = await GameIdConflictsWithExistingGame(gameId);
        if (!causesConflicts) return gameId;
        gameId = generateGameId();
    }

    throw Error(`After trying to generate a gameid for ${gameIdGenerationTries} times, it caused conflicts all the time`);
} 

async function GameIdConflictsWithExistingGame(gameId: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
        const gameExists = await ActiveGameWithIdAlreadyExists(gameId, tx);
        const lobbyExists = await LobbyWithIdAlreadyExists(gameId, tx);

        return gameExists || lobbyExists;
    });    
}

async function ActiveGameWithIdAlreadyExists(gameId: string, tx: DbOrTransaction): Promise<boolean> {
    const game = await tx.query.ActiveGameTable.findFirst({
        where: (game, { eq }) =>
            eq(game.id, gameId),
            columns: { id: true },
        });

    return game != undefined && game != null;
}

async function LobbyWithIdAlreadyExists(gameId: string, tx: DbOrTransaction): Promise<boolean> {
    const lobby = await tx.query.OnlineLobbyTable.findFirst({
        where: (lobby, { eq }) =>
            eq(lobby.id, gameId),
            columns: { id: true },
        });

    return lobby != undefined && lobby != null;
}
