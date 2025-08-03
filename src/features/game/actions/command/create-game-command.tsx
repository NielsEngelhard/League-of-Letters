"use server"

import GetWordsCommand from "@/features/word/actions/command/get-words-command";
import { CreateGameSchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { ActiveGamePlayerTable, ActiveGameRoundTable, ActiveGameTable } from "@/drizzle/schema";
import { GameRoundFactory } from "../../util/factories/game-round-factory";
import { GamePlayerFactory } from "../../util/factories/game-player-factory";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";


export default async function CreateGameCommand(command: CreateGameSchema, secretKey: string): Promise<string> {
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");

    const words = await GetWordsCommand(command.wordLength, command.totalRounds, "nl");

    const gameId = generateGameId();

    await db.transaction(async (tx) => {
        await tx.insert(ActiveGameTable).values({
            id: gameId,
            nRounds: command.totalRounds,            
            gameMode: command.gameMode,
            wordLength: command.wordLength,
            currentRoundIndex: 1,
            nGuessesPerRound: command.guessesPerRound
        }).returning({
            gameId: ActiveGameTable.id
        });

        var rounds = GameRoundFactory.createDbRounds(words, gameId);
        await tx.insert(ActiveGameRoundTable).values(rounds);

        var players = GamePlayerFactory.createGamePlayer(gameId, authSession.id, authSession.username);
        await tx.insert(ActiveGamePlayerTable).values(players);
    });

    return gameId;
}