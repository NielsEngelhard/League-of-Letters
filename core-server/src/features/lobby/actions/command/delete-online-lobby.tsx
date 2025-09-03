"use server"

import { db } from "@/drizzle/db";
import { OnlineLobbyTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { EmitDeleteGameRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { eq } from "drizzle-orm";

export default async function DeleteOnlineLobbyById(lobbyId: string, tx?: DbOrTransaction, notifyPlayers?: boolean): Promise<boolean> {
    const dbInstance = tx || db;
    
    const result = await dbInstance.delete(OnlineLobbyTable)
        .where(eq(OnlineLobbyTable.id, lobbyId));
    
    const isDeleted = (result.rowCount ?? 0) > 0;

    if (notifyPlayers && isDeleted) {
        await EmitDeleteGameRealtimeEvent(lobbyId);
    }

    return isDeleted;
}