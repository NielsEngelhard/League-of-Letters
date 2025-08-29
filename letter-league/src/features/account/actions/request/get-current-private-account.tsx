"use server"

import { db } from "@/drizzle/db";
import { PrivateAccountModel } from "../../account-models";
import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { AccountMapper } from "../../account-mapper";

export default async function GetCurrentPrivateAccount(): Promise<PrivateAccountModel> {
    const currentUserAccountId = await getCurrentUserOrCrash();
    
    const account = await db.select().from(AccountTable).where(eq(AccountTable.id, currentUserAccountId.accountId)).then(rows => rows[0]);

    return AccountMapper.DbAccountToPrivateModel(account);
}