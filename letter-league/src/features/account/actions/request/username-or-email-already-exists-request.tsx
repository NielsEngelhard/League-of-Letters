"use server"

import { db } from "@/drizzle/db";
import { AccountTable } from "@/drizzle/schema";
import { eq, or } from "drizzle-orm";

export interface UsernameOrEmailAlreadyExistsRequestData {
    username?: string;
    email?: string;
}

export default async function UsernameAlreadyExistsRequest(data: UsernameOrEmailAlreadyExistsRequestData): Promise<string | undefined> {
    const accountRecord = await db.select()
        .from(AccountTable)
        .where(or(
            eq(AccountTable.email, data.email ?? ""),
            eq(AccountTable.username, data.username ?? "")
        ))
        .then(rows => rows[0]);    

    if (!accountRecord) undefined;

    if (accountRecord) {
        if (accountRecord.email == data.email) return "Email address is already in use";
        if (accountRecord.username != "" && accountRecord.username == data.username) return "Username already taken";
    }

    return undefined;
}