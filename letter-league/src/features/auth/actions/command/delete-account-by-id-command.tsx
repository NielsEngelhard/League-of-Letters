"use server"

import { db } from "@/drizzle/db";
import { AccountTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { eq } from "drizzle-orm";

export default async function DeleteAccountById(accountId: string, tx?: DbOrTransaction): Promise<boolean> {
    const dbInstance = tx || db;
    
    const result = await dbInstance.delete(AccountTable)
        .where(eq(AccountTable.id, accountId));
    
    return (result.rowCount ?? 0) > 0;
}