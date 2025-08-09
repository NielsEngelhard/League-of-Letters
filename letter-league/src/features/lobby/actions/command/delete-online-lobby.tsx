"use server"

import { db } from "@/drizzle/db";
import { OnlineLobbyTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { eq } from "drizzle-orm";

export default async function DeleteOnlineLobbyById(lobbyId: string, tx?: DbOrTransaction): Promise<boolean> {
    const dbInstance = tx || db;
    
    const result = await dbInstance.delete(OnlineLobbyTable)
        .where(eq(OnlineLobbyTable.id, lobbyId));
    
    return (result.rowCount ?? 0) > 0;
}