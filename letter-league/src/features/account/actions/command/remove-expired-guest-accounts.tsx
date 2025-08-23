"use server"

import { db } from "@/drizzle/db";
import { AccountTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS } from "@/features/auth/auth-constants";
import { and, eq, lt } from "drizzle-orm";

export default async function RemoveExpiredGuestAccounts(
  tx?: DbOrTransaction
): Promise<boolean> {
  const dbInstance = tx || db;
  
  // Calculate the cutoff date (current time minus the specified hours)
  const cutoffDate = new Date();
  cutoffDate.setHours(cutoffDate.getHours() - GUEST_USER_JWT_EXPIRE_TIME_IN_HOURS);
  
  const result = await dbInstance.delete(AccountTable)
    .where(and(
      eq(AccountTable.isGuestAccount, true),
      lt(AccountTable.createdAt, cutoffDate)
    ));
  
  return (result.rowCount ?? 0) > 0;
}