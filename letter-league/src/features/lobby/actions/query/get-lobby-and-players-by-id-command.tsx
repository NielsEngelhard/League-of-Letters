"use server"

import { db } from "@/drizzle/db";
import { DbOnlineLobbyWithPlayers } from "@/drizzle/schema";

export default async function GetOnlineLobbyAndPlayersByIdRequest(lobbyId: string): Promise<DbOnlineLobbyWithPlayers | undefined> {
    const lobby = await db.query.OnlineLobbyTable.findFirst({
        where: (l, { eq }) => eq(l.id, lobbyId),
        with: {
            players: true
        }
    });
    
    return lobby;
}