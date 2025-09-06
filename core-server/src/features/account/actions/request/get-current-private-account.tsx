"use server"

import { db } from "@/drizzle/db";
import { PrivateAccountModel } from "../../account-models";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { AccountMapper } from "../../account-mapper";
import { GetCurrentUser_Server } from "@/features/auth/current-user";

export default async function GetCurrentPrivateAccount(): Promise<PrivateAccountModel | null> {
    const currentUser = await GetCurrentUser_Server();
    if (!currentUser) return null;
    
    const account = await db.select().from(AccountTable).where(eq(AccountTable.id, currentUser.accountId)).then(rows => rows[0]);

    return AccountMapper.DbAccountToPrivateModel(account);
}
