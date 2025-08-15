"use server";

import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { SettingsSchema } from "../../account-schemas";
import { db } from "@/drizzle/db";
import { AccountSettingsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function UpdateCurrentUserSettingsCommand(updatedSettings: SettingsSchema): Promise<void> {
    const currentUser = await getCurrentUserOrCrash();

    await db.update(AccountSettingsTable)
        .set(updatedSettings)
        .where(eq(AccountSettingsTable.accountId, currentUser.accountId));        
}