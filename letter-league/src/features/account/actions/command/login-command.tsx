"use server"

import z from "zod";
import { loginSchema } from "../../account-schemas";
import { AccountTable, DbAccount } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { comparePasswords } from "@/features/auth/password-hasher";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { PublicAccountModel } from "../../account-models";
import { AccountMapper } from "../../account-mapper";

export default async function LoginCommand(unsafeData: z.infer<typeof loginSchema>): Promise<ServerResponse<PublicAccountModel>> {
    const { success, data } = loginSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid login data");
    
    const account = await findAccountByEmailOrUsername(data.username);

    if (account == null) ServerResponseFactory.error("Could not login");

    const isCorrectPassword = await comparePasswords({
        hashedPassword: account.password,
        salt: account.salt,
        password: data.password,        
    });

    if (!isCorrectPassword) ServerResponseFactory.error("Could not login");

    // TODO: CREATE SESSION
    // await createUserSession({
    //     userId: user.id,
    //     role: user.role,
    //     sessionId: ""
    // }, await cookies());

    return ServerResponseFactory.success(AccountMapper.DbAccountToPublicModel(account));
}

async function findAccountByEmailOrUsername(usernameOrEmail: string): Promise<DbAccount> {
    const usernameIsEmail = usernameOrEmail.includes("@");
  
    const users = usernameIsEmail
      ? await db.select().from(AccountTable).where(eq(AccountTable.email, usernameOrEmail))
      : await db.select().from(AccountTable).where(eq(AccountTable.username, usernameOrEmail));
  
    return users[0] ?? null;
  }