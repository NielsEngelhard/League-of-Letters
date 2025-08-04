"use server"

import { DbAuthSession } from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export default async function GetAuthSessionBySecreyKeyRequest(secretKey: string): Promise<DbAuthSession | undefined> {
    const authSession = await db.query.AuthSessionTable.findFirst({
        where: (authSession, { eq }) => eq(authSession.secretKey, secretKey)
    });

    return authSession;
}