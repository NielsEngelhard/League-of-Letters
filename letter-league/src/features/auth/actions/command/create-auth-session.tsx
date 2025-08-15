"use server"

import { db } from "@/drizzle/db"
import { AuthSessionTable, DbAuthSession } from "@/drizzle/schema"
import { AuthMapper } from "../../auth-mapper";
import { AuthSessionModel } from "../../auth-models";
import { generateUUID } from "@/lib/token-generation";
import GenerateRandomUsername from "@/features/account/actions/command/generate-random-username";
import crypto from "crypto";

const SESSION_EXPIRATION_DAYS = 7;
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * SESSION_EXPIRATION_DAYS;
const COOKIE_SESSION_KEY = "session-id";

export interface CreateAuthSessionCommandData {
    forAccountId?: string; // empty = guest session
}

export default async function CreateAuthSession(data: CreateAuthSessionCommandData, cookies: Cookies): Promise<void> {
    const sessionId = crypto.randomBytes(512).toString("hex").normalize();
    
    await CreateAuthSessionDatabaseRecord(data);
    
    setCookie(sessionId, cookies);
}

async function CreateAuthSessionDatabaseRecord(data: CreateAuthSessionCommandData): Promise<DbAuthSession> {
    const secretKey = generateUUID();
    const randomUsername = GenerateRandomUsername();

    const [authSession] = await db.insert(AuthSessionTable).values({
        username: randomUsername,
        secretKey: secretKey,
        isGuestSession: !data.forAccountId,
        accountId: data.forAccountId ? data.forAccountId : undefined,        
    }).returning();    

    return authSession;
}

function setCookie(sessionId: string, cookies: Pick<Cookies, "set">) {
    cookies.set(COOKIE_SESSION_KEY, sessionId, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000,
    })
}

export type Cookies = {
  set: (
    key: string,
    value: string,
    options: {
      secure?: boolean
      httpOnly?: boolean
      sameSite?: "strict" | "lax"
      expires?: number
    }
  ) => void
  get: (key: string) => { name: string; value: string } | undefined
  delete: (key: string) => void
}