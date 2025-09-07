"use server"

import { db } from "@/drizzle/db";
import { AccountTable } from "@/drizzle/schema";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { eq } from "drizzle-orm";
import { ChangeLanguageSchema } from "../../account-schemas";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { SupportedLanguage } from "@/features/i18n/languages";
import RefreshJwtToken from "@/features/auth/actions/command/refresh-token-command";

export default async function UpdateCurrentUserLanguage(data: ChangeLanguageSchema): Promise<ServerResponse<SupportedLanguage>> {
    const currentUser = await AuthenticateOrRedirect_Server();

    await db.update(AccountTable)
        .set({
            language: data.language
        })
        .where(eq(AccountTable.id, currentUser.accountId));

    // Generate new JWT, because language is included in JWT and must be updated too
    await RefreshJwtToken();

    return ServerResponseFactory.success(data.language);
}