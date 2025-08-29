"use server"

import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { ActiveGameTeaserModel } from "../../game-models";
import { db } from "@/drizzle/db";
import { and, eq } from "drizzle-orm";
import { ActiveGameTable, GamePlayerTable } from "@/drizzle/schema";

export default async function GetActiveGamesForCurrentPlayerRequest(): Promise<ActiveGameTeaserModel[]> {
    const account = await getCurrentUserOrCrash();
    
    const games = await db
    .select({
        id: ActiveGameTable.id,
        gameMode: ActiveGameTable.gameMode,
        currentRoundIndex: ActiveGameTable.currentRoundIndex,
        totalRounds: ActiveGameTable.nRounds,
        createdAt: ActiveGameTable.createdAt,
        language: ActiveGameTable.language
    })
    .from(ActiveGameTable)
    .innerJoin(GamePlayerTable, eq(GamePlayerTable.gameId, ActiveGameTable.id))
    .where(and(
        eq(ActiveGameTable.gameIsOver, false),
        eq(GamePlayerTable.accountId, account.accountId)
    ));

    return games;
}