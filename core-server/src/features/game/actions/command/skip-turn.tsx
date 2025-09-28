"use server"

import { GuessWordResponse } from "./guess-word-command"
import { db } from "@/drizzle/db";
import { ActiveGameTable, DbActiveGame, DbActiveGameWithRounds, DbGameRound, GameRoundTable } from "@/drizzle/schema";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { EvaluatedWordFactory } from "@/features/word/util/factories/evaluated-word-factory";
import { getCurrentUtcDate } from "@/lib/time-util";
import { eq } from "drizzle-orm";

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

    const currentGuessUtcDate = getCurrentUtcDate();

    if (endGame) {
        await triggerEndGame(game);
    } else if (endCurrentRound) {        
        await triggerNextRound(nextRound!, game, currentGuessUtcDate);
    } else {
        await triggerNextGuess(currentRound, currentGuessUtcDate);
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
            lastGuessUtcDate: currentGuessUtcDate
        } : undefined,
        unguessedMisplacedLetters: []
    }    
}

async function triggerNextGuess(currentRound: DbGameRound, lastGuessUtcDate?: Date) {
    // Increase guess index and set lastGuessUtcDate
    await db.update(GameRoundTable)
        .set({
            currentGuessIndex: currentRound.currentGuessIndex + 1,
            lastGuessUtcDate: lastGuessUtcDate,
        })
        .where(eq(GameRoundTable.id, currentRound.id));        
}

async function triggerNextRound(nextRound: DbGameRound, game: DbActiveGame, lastGuessUtcDate?: Date) {
    await db.transaction(async (tx) => {     
        await updateGameForNextRound(game, tx);

        if (lastGuessUtcDate) {
            updateNextRoundsLastGuessUtcDate(nextRound.id, lastGuessUtcDate, tx);
        }
    });          
}

async function updateNextRoundsLastGuessUtcDate(nextRoundId: string, lastGuessUtcDate: Date, tx: DbOrTransaction) {
    await tx.update(GameRoundTable)
        .set({
            lastGuessUtcDate: lastGuessUtcDate
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
