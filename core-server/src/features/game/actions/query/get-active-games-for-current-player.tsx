"use server"

import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { ActiveGameTeaserModel } from "../../game-models";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { ActiveGameTable, gameModeEnum, GamePlayerTable, OnlineLobbyPlayerTable, OnlineLobbyTable } from "@/drizzle/schema";
import { GameMapper } from "../../game-mapper";


export default async function GetActiveGamesForCurrentPlayerRequest(): Promise<ActiveGameTeaserModel[]> {
    const account = await AuthenticateOrRedirect_Server();
    
    // Get active games
    const games = await db
        .select({
            id: ActiveGameTable.id,
            gameMode: ActiveGameTable.gameMode,
            currentRoundIndex: ActiveGameTable.currentRoundIndex,
            totalRounds: ActiveGameTable.nRounds,
            createdAt: ActiveGameTable.createdAt,
            language: ActiveGameTable.language,
            hostAccountId: ActiveGameTable.hostAccountId
        })
        .from(ActiveGameTable)
        .innerJoin(GamePlayerTable, eq(GamePlayerTable.gameId, ActiveGameTable.id))
        .where(and(
            eq(ActiveGameTable.gameIsOver, false),
            eq(GamePlayerTable.accountId, account.accountId)
        ));

    // Get online lobbies where the user is a player
    const lobbies = await db
        .select({
            id: OnlineLobbyTable.id,            
            hostAccountId: OnlineLobbyTable.hostAccountId,
            language: OnlineLobbyTable.language,
            createdAt: OnlineLobbyTable.createdAt
        })
        .from(OnlineLobbyTable)
        .innerJoin(OnlineLobbyPlayerTable, eq(OnlineLobbyPlayerTable.lobbyId, OnlineLobbyTable.id))
        .where(eq(OnlineLobbyPlayerTable.accountId, account.accountId));

    const mappedLobbies = lobbies.map(lobby => GameMapper.LobbyToActiveGameTeaserModel(lobby));

    return [...games, ...mappedLobbies];
}