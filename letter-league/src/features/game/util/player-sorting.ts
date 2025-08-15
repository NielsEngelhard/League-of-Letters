import { DbGamePlayer } from "@/drizzle/schema";
import { GamePlayerModel } from "../game-models";

export function sortPlayerModelOnPositionAndGetUserIds(players: GamePlayerModel[]) {
    return players
        .slice() // create a copy so original array is not mutated
        .sort((a, b) => a.position - b.position)
        .map(p => p.accountId);
}

export function sortDbPlayerOnPositionAndGetUserIds(players: DbGamePlayer[]) {
    return players
        .slice() // create a copy so original array is not mutated
        .sort((a, b) => a.position - b.position)
        .map(p => p.accountId);
}