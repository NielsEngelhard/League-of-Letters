import { db } from "@/drizzle/db";
import { GamePlayerTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { ConnectionStatus } from "@/features/realtime/realtime-models";
import { and, eq } from "drizzle-orm";

interface Props {
    accountId: string;
    gameId: string;
    connectionStatus: ConnectionStatus;
}

export default async function UpdateActiveGamePlayerConnectionStatus(data: Props, tx?: DbOrTransaction) {
    const dbInstance = tx || db;    
    
    await dbInstance.update(GamePlayerTable)
        .set({
            connectionStatus: data.connectionStatus
        })
        .where(and(
            eq(GamePlayerTable.accountId, data.accountId),
            eq(GamePlayerTable.gameId, data.gameId)
        ));
}