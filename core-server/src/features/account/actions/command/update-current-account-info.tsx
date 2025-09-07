"use server"

import { db } from "@/drizzle/db";
import { updateAccountSchema, UpdateAccountSchema } from "../../account-schemas";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { PublicAccountModel } from "../../account-models";
import { AccountMapper } from "../../account-mapper";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import RefreshJwtToken from "@/features/auth/actions/command/refresh-token-command";

export default async function UpdateCurrentAccountInfo(unsafeData: UpdateAccountSchema): Promise<ServerResponse<PublicAccountModel>> {
    const { success, data } = updateAccountSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid data");

    const currentAccount = await AuthenticateOrRedirect_Server();

    const result = await db.update(AccountTable)
        .set({
            colorHex: data.favouriteColor,
            username: data.username,
            favouriteWord: data.favouriteWord
        })
        .where(eq(AccountTable.id, currentAccount.accountId))
        .returning();
        

    // Generate new JWT, because username is included in JWT and must be updated too
    await RefreshJwtToken();        

    return ServerResponseFactory.success(AccountMapper.DbAccountToPublicModel(result[0]));
}