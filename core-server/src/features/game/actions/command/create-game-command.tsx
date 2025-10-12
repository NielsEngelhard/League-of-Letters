"use server"

import GetWordsCommand from "@/features/word/actions/command/get-words-command";
import { CreateGameSchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, DbGamePlayer, GameMode } from "@/drizzle/schema";
import { GameRoundFactory } from "../../util/factories/game-round-factory";
import { GamePlayerFactory } from "../../util/factories/game-player-factory";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { and, eq, inArray } from "drizzle-orm";
import { JwtAccountPayload } from "@/features/auth/jwt/jwt-models";
import { shuffleArray } from "@/lib/array-util";
import { GetNextGuessExpiresUtcDate } from "../../util/timed-game-util";


export default async function CreateGameCommand(schema: CreateGameSchema, gameId?: string, transaction?: DbOrTransaction): Promise<string> {
    const dbInstance = transaction || db;
    
    const currentUser = await AuthenticateOrRedirect_Server();

    if (schema.gameMode == "solo") {
        AddCallerAsOnlyPlayer(schema, currentUser);
    }

    const words = await GetWordsCommand(schema.wordLength, schema.totalRounds, schema.language);

    if (!gameId) gameId = generateGameId();

    const accountIds: string[] = schema.gameMode == "solo" ? [currentUser.accountId] : schema.players?.map(p => p.accountId) ?? [];

    await dbInstance.transaction(async (tx) => {
        await cleanupOtherCurrentGames(accountIds, schema.gameMode, tx);

        await tx.insert(ActiveGameTable).values({
            id: gameId,
            nRounds: schema.totalRounds * ((schema.players?.length ?? 1) * schema.totalRounds), // TODO: RENAME - totalRounds is actually rounds per player in lobby            
            gameMode: schema.gameMode,
            currentRoundIndex: 1,
            nGuessesPerRound: schema.guessesPerRound,
            hostAccountId: currentUser.accountId,
            nSecondsPerGuess: schema.nSecondsPerGuess,
            withStartingLetter: schema.withStartingLetter,
            language: schema.language
        }).returning({
            gameId: ActiveGameTable.id
        });

        const rounds = GameRoundFactory.createDbRounds({
            gameId: gameId,
            words: words,            
            firstLetterIsGuessed: schema.withStartingLetter == true,
            currentGuessMaxUtcDate: GetNextGuessExpiresUtcDate(schema.nSecondsPerGuess, schema.wordLength)
        });
        await tx.insert(GameRoundTable).values(rounds);

        const players = createPlayers(schema, gameId);
        await tx.insert(GamePlayerTable).values(players);                
    });

    return gameId;
}


function createPlayers(schema: CreateGameSchema, gameId: string): DbGamePlayer[] {
    if (!schema.players) throw Error("No players assigned");

    // Randomize order for players
    schema.players = shuffleArray(schema.players);

    return schema.players?.map((schemaPlayer, index) => 
        GamePlayerFactory.createGamePlayer(gameId, schemaPlayer.accountId, index + 1, schemaPlayer.connectionStatus ?? "empty", schemaPlayer.username, schemaPlayer.colorHex)
    );
}

function AddCallerAsOnlyPlayer(schema: CreateGameSchema, currentUser: JwtAccountPayload) {
    schema.players = [
        {
            accountId: currentUser.accountId,
            username: currentUser.username,
            colorHex: currentUser.colorHex ?? "#3B82F6"
        }
    ];
}

async function cleanupOtherCurrentGames(accountIds: string[], gameMode: GameMode, tx: DbOrTransaction) {
    if (gameMode == "online") {
        await setPlayersAsLeftInOtherOnlineGames(accountIds, tx);
        // TODO: also send realtime event so that other players know that he left
    } else {
        await removeSoloGamesForPlayer(accountIds[0], tx);
    }
}

async function removeSoloGamesForPlayer(accountId: string, tx: DbOrTransaction) {
    await tx.delete(ActiveGameTable)
        .where(
            eq(ActiveGameTable.hostAccountId, accountId)
        );
}

async function setPlayersAsLeftInOtherOnlineGames(accountIds: string[], tx: DbOrTransaction) {
    return await tx.update(GamePlayerTable)
        .set({
            playerLeft: true
        })
        .from(ActiveGameTable)
        .where(and(
            inArray(GamePlayerTable.accountId, accountIds),
            eq(ActiveGameTable.gameMode, "online")
        ))
        .returning({
            gameId: GamePlayerTable.gameId,
            accountId: GamePlayerTable.accountId
        });
}
