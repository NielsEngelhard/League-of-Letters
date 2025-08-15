"use server"

import GetWordsCommand from "@/features/word/actions/command/get-words-command";
import { CreateGameSchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, DbGamePlayer } from "@/drizzle/schema";
import { GameRoundFactory } from "../../util/factories/game-round-factory";
import { GamePlayerFactory } from "../../util/factories/game-player-factory";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { CurrentUserData, getCurrentUserOrCrash } from "@/features/auth/current-user";


export default async function CreateGameCommand(schema: CreateGameSchema, gameId?: string, transaction?: DbOrTransaction): Promise<string> {
    const dbInstance = transaction || db;
    
    const currentUser = await getCurrentUserOrCrash();

    if (schema.gameMode == "solo") {
        AddCallerAsOnlyPlayer(schema, currentUser);
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

function AddCallerAsOnlyPlayer(schema: CreateGameSchema, currentUser: CurrentUserData) {
    schema.players = [
        {
            userId: currentUser.accountId,
            username: currentUser.username
        }
    ];
}