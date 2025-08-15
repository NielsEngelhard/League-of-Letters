"use server"

import z from "zod";
import { loginSchema } from "../../../account/account-schemas";
import { AccountTable, DbAccount } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { comparePasswords } from "@/features/auth/password-hasher";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { PublicAccountModel } from "../../../account/account-models";
import { AccountMapper } from "../../../account/account-mapper";
import { JWTService } from "../../jwt-service";

export default async function LoginCommand(unsafeData: z.infer<typeof loginSchema>): Promise<ServerResponse<PublicAccountModel>> {
    const { success, data } = loginSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid login data");
    
    const account = await findAccountByEmailOrUsername(data.username);
    
    if (!account) return ServerResponseFactory.error("Could not login");
    if (account.isGuestAccount) return ServerResponseFactory.error("Can't login to a GUEST_SESSION");

    const isCorrectPassword = await comparePasswords({
        hashedPassword: account.password,
        salt: account.salt,
        password: data.password,        
    });

    if (!isCorrectPassword) ServerResponseFactory.error("Could not login");

    await JWTService.setAuthCookie({
      accountId: account.id,
      email: account.email,
      username: account.username,
      isGuest: false
    });

    return ServerResponseFactory.success(AccountMapper.DbAccountToPublicModel(account));
}

async function findAccountByEmailOrUsername(usernameOrEmail: string): Promise<DbAccount> {
    const usernameIsEmail = usernameOrEmail.includes("@");
  
    const users = usernameIsEmail
      ? await db.select().from(AccountTable).where(eq(AccountTable.email, usernameOrEmail))
      : await db.select().from(AccountTable).where(eq(AccountTable.username, usernameOrEmail));
  
    return users[0] ?? null;
  }