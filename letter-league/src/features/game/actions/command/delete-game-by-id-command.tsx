"use server"

import { db } from "@/drizzle/db";
import { ActiveGameTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { eq } from "drizzle-orm";

export default async function DeleteGameByIdCommand(gameId: string, tx?: DbOrTransaction): Promise<boolean> {
    const dbInstance = tx || db;
    
    const result = await dbInstance.delete(ActiveGameTable)
        .where(eq(ActiveGameTable.id, gameId));
    
    return (result.rowCount ?? 0) > 0;
}