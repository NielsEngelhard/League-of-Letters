"use server";

import z from "zod";
import { AccountSettingsTable, AccountTable, DbAccount, DbAccountSettings } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";
import { db } from "@/drizzle/db";
import GenerateRandomUsername from "../../../account/actions/command/generate-random-username";
import AccountFactory from "../../../account/account-factory";
import { SignUpSchema, signUpSchema } from "../../auth-schemas";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";

export default async function CreateAccountCommand(unsafeData: z.infer<typeof signUpSchema>): Promise<ServerResponse<void>> {
    const { success, data } = signUpSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid data");

    if (!data.username || data.username == "") data.username = GenerateRandomUsername();

    const existingUserByEmail = await db.select()
        .from(AccountTable)
        .where(or(
            eq(AccountTable.email, data.email),
            eq(AccountTable.username, data.username ?? "")
        ))
        .then(rows => rows[0]);

    if (existingUserByEmail) {
        if (existingUserByEmail.email == data.email) return ServerResponseFactory.error("Email address is already in use");
        if (existingUserByEmail.username != "" && existingUserByEmail.username == data.username) return ServerResponseFactory.error("Username is already in use");
    }
    
    try {
        const account = await createDatabaseRecords(data);        
        if (!account) return ServerResponseFactory.error("Unable to create account");
    } catch (ex) {
        console.log(ex);
        return ServerResponseFactory.error("Unable to create account");
    }

    return ServerResponseFactory.success(undefined);
}

async function createDatabaseRecords(data: SignUpSchema): Promise<DbAccount> {
    const accountRecord: DbAccount = await AccountFactory.createDbAccount(data.email, data.username!, data.password, false, data.language);
    const settingsRecord: DbAccountSettings = AccountFactory.createDbAccountSettings(accountRecord.id);

    await db.transaction(async (tx) => {
        await tx
            .insert(AccountTable)
            .values(accountRecord);         

        await tx.insert(AccountSettingsTable).values(settingsRecord);  
    });

    return accountRecord;
};