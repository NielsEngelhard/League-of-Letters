"use server";

import z from "zod";
import { signUpSchema } from "../../../account/account-schemas";
import { AccountSettingsTable, AccountTable, DbAccount, DbAccountSettings } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";
import { db } from "@/drizzle/db";
import GenerateRandomUsername from "../../../account/actions/command/generate-random-username";
import { generateSalt, hashPassword } from "@/features/auth/password-hasher";
import AccountFactory from "../../../account/account-factory";

export default async function CreateAccountCommand(unsafeData: z.infer<typeof signUpSchema>) {
    const { success, data } = signUpSchema.safeParse(unsafeData);
    if (!success) return "Login failed";

    if (!data.username || data.username == "") data.username = GenerateRandomUsername();

    const existingUserByEmail = await db.select()
        .from(AccountTable)
        .where(or(
            eq(AccountTable.email, data.email),
            eq(AccountTable.username, data.username ?? "")
        ))
        .then(rows => rows[0]);

    if (existingUserByEmail) {
        if (existingUserByEmail.email == data.email) return "Email address is already in use";
        if (existingUserByEmail.username != "" && existingUserByEmail.username == data.username) return "Username already taken";
    }
    
    try {
        const salt = generateSalt();
        const hashedPassword = await hashPassword(data.password, salt);
    
        const account = await createDatabaseRecords(data.email, hashedPassword, salt, data.username!);        
        if (!account) return "Unable to create account"; 
    } catch (ex) {
        console.log(ex);
        return "Something went wrong while creating your account";
    }

    return undefined;    
}

async function createDatabaseRecords(email: string, hashedPassword: string, salt: string, username: string): Promise<DbAccount> {
    const accountRecord: DbAccount = AccountFactory.createDbAccount(email, username, hashedPassword, salt);
    const settingsRecord: DbAccountSettings = AccountFactory.createDbAccountSettings(accountRecord.id);

    await db.transaction(async (tx) => {
        await tx
            .insert(AccountTable)
            .values(accountRecord);         

        await tx.insert(AccountSettingsTable).values(settingsRecord);  
    });

    return accountRecord;
};