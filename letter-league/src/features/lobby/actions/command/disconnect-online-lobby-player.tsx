"use server"

import { db } from "@/drizzle/db";
import { OnlineLobbyPlayerTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { and, eq } from "drizzle-orm";

interface Props {
    userId: string;
    lobbyId: string;
}

export default async function DisconnectOnlineLobbyPlayer(data: Props, tx?: DbOrTransaction) {
    const dbInstance = tx || db;
    
    await dbInstance.update(OnlineLobbyPlayerTable)
        .set({
            connectionStatus: "disconnected"
        })
        .where(and(
            eq(OnlineLobbyPlayerTable.userId, data.userId),
            eq(OnlineLobbyPlayerTable.lobbyId, data.lobbyId)
        ));         
}
