"use server"

import { db } from "@/drizzle/db";
import { OnlineLobbyPlayerTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

interface Props {
    userId: string;
    lobbyId: string;
}

export default async function ReconnectOnlineLobbyPlayer(data: Props) {
    await db.update(OnlineLobbyPlayerTable)
        .set({
            connectionStatus: "connected"
        })
        .where(and(
            eq(OnlineLobbyPlayerTable.userId, data.userId),
            eq(OnlineLobbyPlayerTable.lobbyId, data.lobbyId)
        ));         
}
