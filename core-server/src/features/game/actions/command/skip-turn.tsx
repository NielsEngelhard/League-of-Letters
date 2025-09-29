"use server"

import { GuessWordResponse } from "./guess-word-command"
import { db } from "@/drizzle/db";
import { ActiveGameTable, DbActiveGame, DbActiveGameWithRounds, DbGameRound, GameRoundTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { EvaluatedWordFactory } from "@/features/word/util/factories/evaluated-word-factory";
import { eq } from "drizzle-orm";
import { GetNextGuessExpiresUtcDate } from "../../util/timed-game-util";

// Skip turn when timer is up for this guess
export default async function SkipTurn(gameId: string): Promise<GuessWordResponse> {    
    const game = await getGameWithRounds(gameId);
    if (game.gameMode != "online" || !game.nSecondsPerGuess) throw Error(`INVALID Game with ID ${gameId} is not a timed game`);

    const currentRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex);
    if (!currentRound) throw Error(`INVALID can't find current round`);

    const skippedGuessResponse = await UpdateGameState(game, currentRound);
    
    // Handle as a guess word response - so that the client handles the rest (only now it is just an empty response)
    await EmitGuessWordRealtimeEvent(game.id, skippedGuessResponse); 

    return skippedGuessResponse;
}

async function UpdateGameState(game: DbActiveGameWithRounds, currentRound: DbGameRound): Promise<GuessWordResponse> {
    const roundMaxGuessesReached = (currentRound.currentGuessIndex) >= game.nGuessesPerRound;
    const endCurrentRound = roundMaxGuessesReached;
    const endGame = endCurrentRound && (game.currentRoundIndex >= game.nRounds);

    const nextRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex+1);

    const nextGuessMaxUtcDate = GetNextGuessExpiresUtcDate(game.nSecondsPerGuess, currentRound.wordLength);

    if (endGame) {
        await triggerEndGame(game);
    } else if (endCurrentRound) {        
        await triggerNextRound(nextRound!, game, nextGuessMaxUtcDate);
    } else {
        await triggerNextGuess(currentRound, nextGuessMaxUtcDate);
    }    

    return {
        gameId: game.id,
        accountId: "-",
        guessResult: EvaluatedWordFactory.createSkipped(currentRound.wordLength, currentRound.currentGuessIndex),
        score: 0,
        roundTransitionData: endCurrentRound ? {
            isEndOfGame: endGame,
            currentWord: currentRound.word.originalWord,
            nextRoundFirstLetter: nextRound?.word.strippedWord[0],            
        } : undefined,
        unguessedMisplacedLetters: [],
        nextGuessMaxUtcDate: nextGuessMaxUtcDate
    }    
}

async function triggerNextGuess(currentRound: DbGameRound, nextGuessMaxUtcDate?: Date) {
    // Increase guess index and set nextGuessMaxUtcDate
    await db.update(GameRoundTable)
        .set({
            currentGuessIndex: currentRound.currentGuessIndex + 1,
            currentGuessMaxUtcDate: nextGuessMaxUtcDate,
        })
        .where(eq(GameRoundTable.id, currentRound.id));        
}

async function triggerNextRound(nextRound: DbGameRound, game: DbActiveGame, nextGuessMaxUtcDate?: Date) {
    await db.transaction(async (tx) => {     
        await updateGameForNextRound(game, tx);

        if (nextGuessMaxUtcDate) {
            updateNextRoundsNextGuessUtcDate(nextRound.id, nextGuessMaxUtcDate, tx);
        }
    });
}

async function updateNextRoundsNextGuessUtcDate(nextRoundId: string, nextGuessMaxUtcDate: Date, tx: DbOrTransaction) {
    await tx.update(GameRoundTable)
        .set({
            currentGuessMaxUtcDate: nextGuessMaxUtcDate
        })
        .where(eq(GameRoundTable.id, nextRoundId));    
}

async function updateGameForNextRound(game: DbActiveGame, tx: DbOrTransaction) {
    await tx.update(ActiveGameTable)
        .set({
            currentRoundIndex: game.currentRoundIndex + 1
        })
        .where(eq(ActiveGameTable.id, game.id));
}

async function triggerEndGame(game: DbActiveGameWithRounds): Promise<void> {
    await db.transaction(async (tx) => {   
        // Set game to game over  
        await tx.update(ActiveGameTable).set({
            gameIsOver: true
        }).where(eq(ActiveGameTable.id, game.id));
    });
}

async function getGameWithRounds(gameId: string): Promise<DbActiveGameWithRounds> {
    const game = await db.query.ActiveGameTable.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
        with: {
            rounds: true
        }
    });

    if (!game) throw Error(`Could not find game with ID ${gameId}`);

    return game as unknown as DbActiveGameWithRounds;
}
