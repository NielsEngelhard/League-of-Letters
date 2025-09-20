"use server"

import { getCurrentUtcUnixTimestamp_Seconds } from "@/lib/time-util";
import { GuessWordResponse } from "./guess-word-command"
import { db } from "@/drizzle/db";
import { ActiveGameTable, DbActiveGameWithRoundsAndPlayers, DbGameRound, GameRoundTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { EvaluatedWordFactory } from "@/features/word/util/factories/evaluated-word-factory";

// When the round is skipped but you still want to 
export default async function FinalizeRoundAfterSkip(gameId: string): Promise<GuessWordResponse | null> {
    // Send realtime event once (if not already sent)
    const game = await getGame(gameId);

    const roundToFinalize = getRound(game);
    if (!roundToFinalize) throw Error("No round found");
    if (!roundIsOver(roundToFinalize)) throw Error("Round is not over!!");
    
    const nextRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex+1);
    if (nextRound) await UpdateGameStateForNextRound(game);

    const unixTimestampInSeconds: number | undefined = game.nSecondsPerGuess
        ? getCurrentUtcUnixTimestamp_Seconds() + 3 // 3 seconds extra because of animations and initial delay
        : undefined;
    
    const guessWordResponse: GuessWordResponse = {
        accountId: "",
        guessResult: { position: game.nGuessesPerRound, evaluatedLetters: EvaluatedWordFactory.createSkipped(roundToFinalize.wordLength, game.nGuessesPerRound).evaluatedLetters},
        score: 0,
        unguessedMisplacedLetters: [],
        unixTimestampInSeconds: unixTimestampInSeconds,
        roundTransitionData: {
            currentWord: roundToFinalize.word.originalWord,
            isEndOfGame: game.currentRoundIndex >= game.nRounds,
            nextRoundFirstLetter: nextRound?.word.strippedWord[0],
            lastGuessUnixUtcTimestamp_InSeconds: unixTimestampInSeconds
        }
    }

    // For solo game return response, for online game notify everybody via websocket/realtime
    if (game.gameMode == "online") {
        await EmitGuessWordRealtimeEvent(game.id, guessWordResponse);
        return null;
    } else { // solo
    return guessWordResponse;
    }
}

async function UpdateGameStateForNextRound(game: DbActiveGameWithRoundsAndPlayers) {
    await db.transaction(async (tx) => {

        // ActiveGameTable
        await tx.update(ActiveGameTable)
            .set({
                currentRoundIndex: game.currentRoundIndex + 1
            })
            .where(eq(ActiveGameTable.id, game.id));                  
    })
}

function getRound(game: DbActiveGameWithRoundsAndPlayers): DbGameRound | undefined {
    return game.rounds.find(r => r.roundNumber == game.currentRoundIndex);
}

function roundIsOver(currentRound: DbGameRound): boolean {
    // Is it with time? 
    // Not with time? Then just STOP DLOW

    // Is with time, check if it really is the current round.

    return true;
}

async function getGame(gameId: string): Promise<DbActiveGameWithRoundsAndPlayers> {
    const game = await db.query.ActiveGameTable.findFirst({
        where: (game, { eq }) => eq(game.id, gameId),
        with: {
            rounds: true, // OPTIMIZE: maybe only retrieve the relevant rounds
            players: true // OPTIMIZE: maybe only retrieve the relevant players
        }
    });

    if (!game) throw Error(`Could not find game with ID ${gameId}`);

    return game as unknown as DbActiveGameWithRoundsAndPlayers;
}