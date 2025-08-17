"use server"

import { db } from "@/drizzle/db";
import { ActiveGameTable, GamePlayerTable, OnlineLobbyPlayerTable, OnlineLobbyTable } from "@/drizzle/schema";
import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { EmitPlayerKickedRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { and, eq, inArray } from "drizzle-orm";

interface KickPlayerData {
    lobbyId: string;
    accountIdToKick: string;
}

export default async function KickPlayerFromLobbyCommand(data: KickPlayerData) {
    const currentUser = await getCurrentUserOrCrash();

    const result = await db
    .delete(OnlineLobbyPlayerTable)
    .where(and(
        eq(OnlineLobbyPlayerTable.lobbyId, data.lobbyId),
        eq(OnlineLobbyPlayerTable.accountId, data.accountIdToKick),
        inArray(
        OnlineLobbyPlayerTable.lobbyId,
        db.select({ id: OnlineLobbyTable.id })
            .from(OnlineLobbyTable)
            .where(eq(OnlineLobbyTable.hostAccountId, currentUser.accountId))
        )
    ));

    const wasDeleted = result.rows.length === 0;

    if (wasDeleted) {
        await EmitPlayerKickedRealtimeEvent(data.lobbyId, data.accountIdToKick);
    }
} 