"use server"

import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { ChangePasswordSchema } from "../../account-schemas";
import { comparePasswords, generateSalt, hashPassword } from "@/features/auth/password-hasher";
import { db } from "@/drizzle/db";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";

export default async function ChangePasswordCommand(data: ChangePasswordSchema): Promise<ServerResponse<void>> {
    const currentUser = await AuthenticateOrRedirect_Server();

    const currentPasswordInfo = await GetCurrentPasswordAndSalt(currentUser.accountId);

    const isCorrectPassword = await comparePasswords({
        hashedPassword: currentPasswordInfo.password,
        salt: currentPasswordInfo.salt,
        password: data.oldPassword,        
    });    
    
    if (!isCorrectPassword) return ServerResponseFactory.error("Incorrect password");

    await ChangePassword(currentUser.accountId, data.newPassword);

    return ServerResponseFactory.success(undefined);
} 

async function ChangePassword(accountId: string, unhashedPassword: string) {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(unhashedPassword, salt);    

    await db.update(AccountTable)
        .set({ 
            password: hashedPassword,
            salt: salt
        })
        .where(eq(AccountTable.id, accountId))
}

async function GetCurrentPasswordAndSalt(accountId: string): Promise<{ password: string, salt: string}> {
    const result = await db.select({
        password: AccountTable.password,
        salt: AccountTable.salt
    })
    .from(AccountTable)
    .where(eq(AccountTable.id, accountId));

    return result[0];
}