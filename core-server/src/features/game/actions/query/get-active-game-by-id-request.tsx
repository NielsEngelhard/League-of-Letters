"use server"

import { db } from "@/drizzle/db";
import { ActiveGameModel } from "../../game-models";
import { DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { GameMapper } from "../../game-mapper";

export async function GetActiveGameByIdRequest(gameId: string): Promise<ActiveGameModel | null> {
    try {
        const game = await getGame(gameId);
        return GameMapper.ActiveGameToModel(game);        
    } catch {
        return null;
    }
}

async function getGame(gameId: string): Promise<DbActiveGameWithRoundsAndPlayers> {
    const game = await db.query.ActiveGameTable.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
        with: {
            rounds: true,
            players: true
        }
    });

    if (!game) throw Error(`Could not find active game with ID ${gameId}`);

    return game as unknown as DbActiveGameWithRoundsAndPlayers;
}