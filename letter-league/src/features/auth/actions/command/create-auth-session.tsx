"use server"

import { db } from "@/drizzle/db"
import { AuthSessionTable } from "@/drizzle/schema"
import { AuthMapper } from "../../auth-mapper";
import { AuthSessionModel } from "../../auth-models";
import { generateUUID } from "@/lib/token-generation";
import GenerateRandomUsername from "@/features/account/actions/command/generate-random-username";

export default async function CreateAuthSession(): Promise<AuthSessionModel> {
    const secretKey = generateUUID();
    const randomUsername = GenerateRandomUsername();

    const [authSession] = await db.insert(AuthSessionTable).values({
        username: randomUsername,
        secretKey: secretKey,
    }).returning();
    
    return AuthMapper.MapSessionToModel(authSession);
}
