"use server"

import { CreateGameLobbySchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { OnlineLobbyTable } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { GameMapper } from "../../game-mapper";


export default async function CreateGameLobbyCommand(command: CreateGameLobbySchema, secretKey: string): Promise<string> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");

    const gameId = generateGameId();

    await db.transaction(async (tx) => {
        await tx.insert(OnlineLobbyTable).values({
            id: gameId,
            userHostId: authSession.id,
            players: [ GameMapper.AuthSessionToLobbyPlayer(authSession) ]            
        }).returning({
            gameId: OnlineLobbyTable.id
        });
    });

    return gameId;
}