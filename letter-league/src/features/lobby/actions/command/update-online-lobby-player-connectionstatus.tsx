"use server"

import { db } from "@/drizzle/db";
import { OnlineLobbyPlayerTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { ConnectionStatus } from "@/features/realtime/realtime-models";
import { and, eq } from "drizzle-orm";

interface Props {
    userId: string;
    lobbyId: string;
    connectionStatus: ConnectionStatus;
}

export default async function UpdateOnlineLobbyPlayerConnectionStatus(data: Props, tx?: DbOrTransaction) {
    const dbInstance = tx || db;
    
    await dbInstance.update(OnlineLobbyPlayerTable)
        .set({
            connectionStatus: data.connectionStatus
        })
        .where(and(
            eq(OnlineLobbyPlayerTable.userId, data.userId),
            eq(OnlineLobbyPlayerTable.lobbyId, data.lobbyId)
        ));         
}
