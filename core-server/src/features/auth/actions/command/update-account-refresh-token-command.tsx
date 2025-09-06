"use server"

import { db } from "@/drizzle/db";
import { CreateTokenResponse } from "../../jwt/jwt-models";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function UpdateAccountRefreshTokenCommand(accountId: string, refreshToken: CreateTokenResponse) {
    await db.update(AccountTable)
        .set({
            refreshToken: refreshToken.token
            // TODO: also set expire date time
        })
        .where(eq(AccountTable.id, accountId));
}