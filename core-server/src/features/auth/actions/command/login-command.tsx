"use server"

import z from "zod";
import { AccountSettingsTable, AccountTable, DbAccount } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { comparePasswords } from "@/features/auth/password-hasher";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { PublicAccountModel } from "../../../account/account-models";
import { AccountMapper } from "../../../account/account-mapper";
import { JWTService } from "../../jwt/jwt-service";
import { JwtMapper } from "../../jwt/jwt-mapper";
import { loginSchema } from "../../auth-schemas";
import { SettingsSchema } from "@/features/account/account-schemas";
import { DEFAULT_SETTINGS } from "../../auth-constants";

export interface LoginResponse {
  account: PublicAccountModel;
  settings: SettingsSchema;
}

export default async function LoginCommand(unsafeData: z.infer<typeof loginSchema>): Promise<ServerResponse<LoginResponse>> {
    const { success, data } = loginSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid login data");
    
    const account = await findAccountByEmail(data.username);
    
    if (!account) return ServerResponseFactory.error("Invalid credentials");
    if (account.isGuestAccount) return ServerResponseFactory.error("Can't login to a GUEST_SESSION");

    const isCorrectPassword = await comparePasswords({
        hashedPassword: account.password,
        salt: account.salt,
        password: data.password,        
    });

    if (!isCorrectPassword) ServerResponseFactory.error("Invalid credentials");

    const settings = await getAccountSettings(account.id);

    const jwtService = new JWTService();
    const jwtPayload = JwtMapper.MapAccountToJwtPayload(account);
    await jwtService.generateTokensAndSetAuthCookies(jwtPayload);

    return ServerResponseFactory.success({
      account: AccountMapper.DbAccountToPublicModel(account),
      settings: settings
    });
}

async function getAccountSettings(accountId: string) {
  const result = await db.select().from(AccountSettingsTable).where(eq(AccountSettingsTable.accountId, accountId));
  return (result && result.length == 1) ? result[0] : DEFAULT_SETTINGS;
}

async function findAccountByEmail(email: string): Promise<DbAccount> {
  const users = await db.select().from(AccountTable).where(eq(AccountTable.email, email));

  return users[0] ?? null;
}
