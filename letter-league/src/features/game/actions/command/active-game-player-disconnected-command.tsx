import { db } from "@/drizzle/db";
import { GamePlayerTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { and, eq } from "drizzle-orm";

interface Props {
    userId: string;
    gameId: string;
}

export default async function ActiveGamePlayerDisconnectedCommand(data: Props, tx?: DbOrTransaction) {
    const dbInstance = tx || db;    
    
    await dbInstance.update(GamePlayerTable)
        .set({
            connectionStatus: "disconnected"
        })
        .where(and(
            eq(GamePlayerTable.userId, data.userId),
            eq(GamePlayerTable.gameId, data.gameId)
        ));
}