"use server"

import { db } from "@/drizzle/db"
import { AccountTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm";
import { JWTService } from "../../jwt/jwt-service";
import { JwtMapper } from "../../jwt/jwt-mapper";
import { JwtAccountPayload } from "../../jwt/jwt-models";
import { cookies } from "next/headers";
import { REFRESH_COOKIE_NAME } from "../../auth-constants";

export default async function RefreshJwtToken(refreshToken: string | null = null): Promise<JwtAccountPayload | null> {
    if (refreshToken == null) {
        const cookieStore = await cookies();
        const refreshTokenCookie = cookieStore.get(REFRESH_COOKIE_NAME)?.value;
        if (!refreshTokenCookie) return null;

        refreshToken = refreshTokenCookie;
    }

    try {
        const account = await getAccountByRefreshToken(refreshToken);
        if (!account) return null;

        const jwtService = new JWTService();
        const jwtPayload = JwtMapper.MapAccountToJwtPayload(account);
        await jwtService.generateTokensAndSetAuthCookies(jwtPayload);

        return jwtPayload;
    } catch(err) {
        console.log(err);
        return null;
    }
}

async function getAccountByRefreshToken(refreshToken: string) {
    const dbResult = await db.select()
        .from(AccountTable)
        .where(eq(AccountTable.refreshToken, refreshToken));

    return dbResult[0];
}