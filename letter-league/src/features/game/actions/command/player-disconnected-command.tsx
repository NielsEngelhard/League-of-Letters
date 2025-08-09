import { db } from "@/drizzle/db";
import { GamePlayerTable, OnlineLobbyPlayerTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

interface Props {
    userId: string;
    gameId: string;
}

export default async function PlayerDisconnectedCommand(data: Props) {
    await db.transaction(async (tx) => {

        await tx.update(GamePlayerTable)
            .set({
                connectionStatus: "disconnected"
            })
            .where(and(
                eq(GamePlayerTable.userId, data.userId),
                eq(GamePlayerTable.gameId, data.gameId)
            ));

        await tx.update(OnlineLobbyPlayerTable)
            .set({
                connectionStatus: "disconnected"
            })
            .where(and(
                eq(OnlineLobbyPlayerTable.userId, data.userId),
                eq(OnlineLobbyPlayerTable.lobbyId, data.gameId)
            ));     
    });
}