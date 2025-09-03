"use server"

import { db } from "@/drizzle/db";
import { AccountTable, ActiveGameTable, DbGamePlayer } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { eq, sql } from "drizzle-orm";

export default async function DeleteGameByIdCommand(gameId: string, tx?: DbOrTransaction): Promise<boolean> {
    const dbInstance = tx || db;
    
    const game = await db.query.ActiveGameTable.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
        with: {
            players: true
        }
    });

    if (!game) return false;

    const gameIsDeleted = await dbInstance.transaction(async (tx) => {
        if (game.gameIsOver) await UpdateAccountRecords(game.players, tx);

        return await deleteGame(gameId, tx);
    });

    return gameIsDeleted;
}

async function UpdateAccountRecords(players: DbGamePlayer[], tx: DbOrTransaction) {
  for (const player of players) {
    const score = player.score;

    await tx
      .update(AccountTable)
      .set({
        // increment games played
        nGamesPlayed: sql`${AccountTable.nGamesPlayed} + 1`,

        // only update highestScoreAchieved if the new score is greater
        highestScoreAchieved: sql`GREATEST(${AccountTable.highestScoreAchieved}, ${score})`,
      })
      .where(eq(AccountTable.id, player.accountId));
  }
}

async function deleteGame(gameId: string, tx: DbOrTransaction): Promise<boolean> {
    const deleteResult = await tx.delete(ActiveGameTable)
        .where(eq(ActiveGameTable.id, gameId));    

    return (deleteResult.rowCount ?? 0) > 0;
}