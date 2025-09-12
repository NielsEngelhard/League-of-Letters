"use server"

import { db } from "@/drizzle/db";
import { AccountSettingsTable } from "@/drizzle/schema";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { eq } from "drizzle-orm";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { ThemeOption } from "../../account-models";

export default async function UpdateCurrentUserTheme(theme: ThemeOption): Promise<ServerResponse<ThemeOption>> {
    const currentUser = await AuthenticateOrRedirect_Server();

    await db.update(AccountSettingsTable)
        .set({
            theme: theme
        })
        .where(eq(AccountSettingsTable.accountId, currentUser.accountId));

    return ServerResponseFactory.success(theme);
}