"use server"

import { db } from "@/drizzle/db"
import { AccountTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm";
import { JWTService } from "../../jwt/jwt-service";
import { JwtMapper } from "../../jwt/jwt-mapper";
import { JwtAccountPayload } from "../../jwt/jwt-models";

export default async function RefreshJwtToken(refreshToken : string): Promise<JwtAccountPayload | null> {
    debugger;
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