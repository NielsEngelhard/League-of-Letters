"use server"

import GetWordsCommand from "@/features/word/actions/command/get-words-command";
import { CreateGameSchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, GameMode, DbAuthSession, DbGamePlayer } from "@/drizzle/schema";
import { GameRoundFactory } from "../../util/factories/game-round-factory";
import { GamePlayerFactory } from "../../util/factories/game-player-factory";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";


export default async function CreateGameCommand(schema: CreateGameSchema, secretKey: string, gameId?: string, transaction?: DbOrTransaction): Promise<string> {
    const dbInstance = transaction || db;
    
    // TODO: refactor to use e.g. cookie for security
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    if (!authSession) throw Error("Could not authenticate user by secretkey");

    if (schema.gameMode == "solo") {
        AddCallerAsOnlyPlayer(schema, authSession);
    }

    const words = await GetWordsCommand(schema.wordLength, schema.totalRounds, "nl");

    if (!gameId) gameId = generateGameId();

    await dbInstance.transaction(async (tx) => {
        await tx.insert(ActiveGameTable).values({
            id: gameId,
            nRounds: schema.totalRounds,            
            gameMode: schema.gameMode,
            wordLength: schema.wordLength,
            currentRoundIndex: 1,
            nGuessesPerRound: schema.guessesPerRound
        }).returning({
            gameId: ActiveGameTable.id
        });

        var rounds = GameRoundFactory.createDbRounds(words, gameId);
        await tx.insert(GameRoundTable).values(rounds);

        var players = createPlayers(schema, gameId);
        await tx.insert(GamePlayerTable).values(players);
    });

    return gameId;
}

function createPlayers(schema: CreateGameSchema, gameId: string): DbGamePlayer[] {
    if (!schema.players) throw Error("No players assigned");

    return schema.players?.map((schemaPlayer, index) => 
        GamePlayerFactory.createGamePlayer(gameId, schemaPlayer.userId, index + 1, schemaPlayer.username)
    );
}

function AddCallerAsOnlyPlayer(schema: CreateGameSchema, authSession: DbAuthSession,) {
    schema.players = [
        {
            userId: authSession.id,
            username: authSession.username
        }
    ];
}