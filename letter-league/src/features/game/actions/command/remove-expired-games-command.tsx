"use server"

import { db } from "@/drizzle/db";
import { ActiveGameTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { eq, lt, or } from "drizzle-orm";

export default async function RemoveExpiredGames(
  hours: number, 
  tx?: DbOrTransaction
): Promise<boolean> {
  const dbInstance = tx || db;
  
  // Calculate the cutoff date (current time minus the specified hours)
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - hours);
  
  const result = await dbInstance.delete(ActiveGameTable)
    .where(or(
      lt(ActiveGameTable.createdAt, cutoffDate), // Game is older than cutoff date (expired regarding created time)
      eq(ActiveGameTable.gameIsOver, true)       // Game is over
    ));
  
  return (result.rowCount ?? 0) > 0;
}