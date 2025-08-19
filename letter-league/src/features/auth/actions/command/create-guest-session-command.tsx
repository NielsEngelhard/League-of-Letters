"use server";

import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { JWTService } from "../../jwt-service";
import AccountFactory from "@/features/account/account-factory";
import { AccountTable, DbAccount } from "@/drizzle/schema";
import { db } from "@/drizzle/db";
import GenerateRandomUsername from "@/features/account/actions/command/generate-random-username";
import { PublicAccountModel } from "@/features/account/account-models";
import { AccountMapper } from "@/features/account/account-mapper";

export default async function CreateGuestSessionCommand(): Promise<ServerResponse<PublicAccountModel>> {
    try {
        const guestAccount = await createTempGuestAccount(); 

        await JWTService.setAuthCookie({
            accountId: guestAccount.id,
            email: guestAccount.email,
            username: guestAccount.username,
            isGuest: true
        }, 'guest');
        
        return ServerResponseFactory.success(AccountMapper.DbAccountToPublicModel(guestAccount));
    } catch(err) {
        console.log("Failed to create GUEST auth session. Reason: " + err);
        return ServerResponseFactory.error("Failed to guest session");
    }
}

async function createTempGuestAccount(): Promise<DbAccount> {
    const isGuestAccount: boolean = true;
    const guestAccountUsername: string = GenerateRandomUsername(isGuestAccount);
    const guestAccountEmail: string = `${guestAccountUsername}@guest_account`;
    const guestAccountPassword: string = "GuestyGuest69";

    const guestAccount = await AccountFactory.createDbAccount(guestAccountEmail, guestAccountUsername, guestAccountPassword, isGuestAccount);

    await db.transaction(async (tx) => {
        await tx
            .insert(AccountTable)
            .values(guestAccount);         
    });

    return guestAccount;
}