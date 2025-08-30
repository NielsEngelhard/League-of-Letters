"use server";

import { getCurrentUserOrRedirect } from "@/features/auth/current-user";
import { SettingsSchema } from "../../account-schemas";
import { db } from "@/drizzle/db";
import { AccountSettingsTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export default async function UpdateCurrentUserSettingsCommand(updatedSettings: SettingsSchema): Promise<void> {
    const currentUser = await getCurrentUserOrRedirect();

    await db.update(AccountSettingsTable)
        .set(updatedSettings)
        .where(eq(AccountSettingsTable.accountId, currentUser.accountId));        
}