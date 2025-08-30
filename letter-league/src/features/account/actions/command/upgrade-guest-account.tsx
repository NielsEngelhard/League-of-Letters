"use server"

import { db } from "@/drizzle/db";
import { upgradeGuestAccountSchema, UpgradeGuestAccountSchema } from "../../account-schemas";
import { AccountTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { generateSalt, hashPassword } from "@/features/auth/password-hasher";
import UsernameAlreadyExistsRequest from "../request/username-or-email-already-exists-request";
import { PublicAccountModel } from "../../account-models";
import { AccountMapper } from "../../account-mapper";

export default async function UpgradeGuestAccountCommand(unsafeData: UpgradeGuestAccountSchema): Promise<ServerResponse<PublicAccountModel>> {
    const { success, data } = upgradeGuestAccountSchema.safeParse(unsafeData);
    if (!success) return ServerResponseFactory.error("Invalid data");

    const currentAccount = await getCurrentUserOrCrash();

    const usernameOrEmailAlreadyExists = await UsernameAlreadyExistsRequest({ email: data.email, username: data.username });
    if (usernameOrEmailAlreadyExists != undefined) {
        return ServerResponseFactory.error(usernameOrEmailAlreadyExists);
    }

    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const updatedAccount = await db.update(AccountTable)
        .set({
            username: data.username,
            language: data.language,
            email: data.email,
            password: hashedPassword,
            salt: salt,
            isGuestAccount: false
        })
        .where(eq(AccountTable.id, currentAccount.accountId))
        .returning();

    return ServerResponseFactory.success(AccountMapper.DbAccountToPublicModel(updatedAccount[0]));
}
