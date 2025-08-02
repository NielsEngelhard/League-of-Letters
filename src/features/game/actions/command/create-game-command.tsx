"use server"

import GetWordsCommand from "@/features/word/actions/command/get-words-command";
import { CreateGameSchema } from "../../game-schemas";
import { generateGameId } from "../../util/game-id-generator";
import { db } from "@/drizzle/db";
import { ActiveGamePlayerTable, ActiveGameRoundTable, ActiveGameTable } from "@/drizzle/schema";
import { GameRoundFactory } from "../../util/factories/game-round-factory";
import { GamePlayerFactory } from "../../util/factories/game-player-factory";


// TODO: make some sort of cookie that is sent along every time?
export default async function CreateGameCommand(command: CreateGameSchema): Promise<string> {
    // GET USER BASED ON COOKIE VALUE?

    const userId = "TODO";

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

        var players = GamePlayerFactory.createGamePlayer(gameId, userId);
        await tx.insert(ActiveGamePlayerTable).values(players);
    });

    return gameId;
}