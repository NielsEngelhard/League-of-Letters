"use server";

import { db } from "@/drizzle/db";
import { CalculateScoreResult } from "@/features/score/score-models";
import { EvaluatedLetter, EvaluatedWord } from "@/features/word/word-models";
import { RoundTransitionData } from "../../game-models";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, DbActiveGame, DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, GameMode } from "@/drizzle/schema";
import { DetailedValidationResult, WordValidator } from "@/features/word/util/word-validator/word-validator";
import DeleteGameByIdCommand from "./delete-game-by-id-command";
import { and, eq } from "drizzle-orm";
import { TurnTrackerAlgorithm } from "../../util/algorithm/turn-tracker-algorithm/turn-tracker";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { ScoreCalculator } from "@/features/score/score-calculator/score-calculator";
import { sortDbPlayerOnPositionAndGetUserIds } from "../../util/player-sorting";
import { getCurrentUserOrCrash } from "@/features/auth/current-user";
import { getCurrentUtcUnixTimestamp_Seconds, getSecondsBetweenNowAndUnixTimestampInSeconds } from "@/lib/time-util";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";

export interface GuessWordCommandInput {
    gameId: string;
    word: string;
}

export interface GuessWordResponse {
    accountId: string;
    guessResult: EvaluatedWord;
    newLetters: EvaluatedLetter[];
    scoreResult: CalculateScoreResult;
    roundTransitionData?: RoundTransitionData;
    unixTimestampInSeconds?: number;
}

export async function GuessWordCommand(command: GuessWordCommandInput): Promise<ServerResponse<GuessWordResponse>> {    
    const game = await getGame(command.gameId);
    
    let currentRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex);
    if (!currentRound) throw Error(`GUESS WORD: INVALID STATE could not find round`);

    let currentPlayer = getPlayerWhosTurnItIs(game, currentRound);

    const isThisPlayersTurn = await isPlayersTurn(currentPlayer);
    if (!isThisPlayersTurn) {
        return ServerResponseFactory.error("Not your turn!");
    }
    
    const validationResult = WordValidator.validateAndFilter(command.word, currentRound.word, currentRound.evaluatedLetters);

    const scoreResult = ScoreCalculator.calculate({
        currentGuessIndex: currentRound.currentGuessIndex,
        newLetters: validationResult.newLetters,
        previouslyGuessedLetters: currentRound.evaluatedLetters,
        wordGuessed: validationResult.allCorrect
    });

    addScoreToPlayer(scoreResult, currentPlayer);

    const currentGuess = await updateCurrentGameState(game, currentRound, validationResult, scoreResult, currentPlayer);

    if (game.gameMode == "online") {
        await EmitGuessWordRealtimeEvent(game.id, currentGuess);
    }

    return ServerResponseFactory.success(currentGuess);
}

function addScoreToPlayer(scoreResult: CalculateScoreResult, player: DbGamePlayer) {
    player.score += scoreResult.totalScore;
}

function getPlayerWhosTurnItIs(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound): DbGamePlayer {
    if (game.players.length == 1) return game.players[0];

    const sortedPlayerIds = sortDbPlayerOnPositionAndGetUserIds(game.players);

    const playerId = TurnTrackerAlgorithm.determineWhosTurnItIs({
        playerIdsInOrder: sortedPlayerIds,
        currentRound: game.currentRoundIndex,
        currentGuess: currentRound.currentGuessIndex,
        secondsPerGuess: game.nSecondsPerGuess,
        secondsBetweenLastGuess: getSecondsBetweenNowAndUnixTimestampInSeconds(currentRound.lastGuessUnixUtcTimestamp_InSeconds)
    });

    return game.players.find(p => p.accountId == playerId)!;
}

async function updateCurrentGameState(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound, validationResult: DetailedValidationResult, scoreResult: CalculateScoreResult, currentPlayer: DbGamePlayer): Promise<GuessWordResponse> {
    const roundMaxGuessesReached = (currentRound.currentGuessIndex) >= game.nGuessesPerRound;
    const endCurrentRound = roundMaxGuessesReached || validationResult.allCorrect;
    const endGame = endCurrentRound && (game.currentRoundIndex >= game.nRounds);

    const currentGuess: EvaluatedWord = {
        position: currentRound.currentGuessIndex,
        evaluatedLetters: validationResult.validatedWord
    }

    const nextRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex+1);

    // TODO: refactor this name
    const unixTimestampInSeconds: number | undefined = game.nSecondsPerGuess
        ? getCurrentUtcUnixTimestamp_Seconds() + 3 // 3 seconds extra because of animations and initial delay
        : undefined;

    if (endGame) {
        currentPlayer.score += scoreResult.totalScore;
        currentRound.guesses.push(currentGuess);
        await triggerEndGame(game);
    } else if (endCurrentRound) {        
        await triggerNextRound(currentRound, nextRound!, validationResult, currentPlayer, scoreResult, game, unixTimestampInSeconds);
    } else {
        await triggerNextGuess(currentRound, validationResult, currentPlayer, scoreResult, unixTimestampInSeconds);
    }

    return {
        accountId: currentPlayer.accountId,
        guessResult: currentGuess,
        newLetters: validationResult.newLetters,
        scoreResult: scoreResult,
        unixTimestampInSeconds: unixTimestampInSeconds,
        roundTransitionData: endCurrentRound ? {
            isEndOfGame: endGame,
            currentWord: currentRound.word.word,
            nextRoundFirstLetter: nextRound?.word.word[0],
            lastGuessUnixUtcTimestamp_InSeconds: unixTimestampInSeconds
        } : undefined
    };    
}

async function triggerNextGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, scoreResult: CalculateScoreResult, unixTimestampInSeconds?: number) {
    await db.transaction(async (tx) => {   
        await updateCurrentGameRoundWithCurrentGuess(currentRound, validationResult, tx, unixTimestampInSeconds);
        await addScoreForPlayer(currentPlayer, scoreResult.totalScore, tx);
    });          
}

async function triggerNextRound(currentRound: DbGameRound, nextRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, scoreResult: CalculateScoreResult, game: DbActiveGame, unixTimestampInSeconds?: number) {
    await db.transaction(async (tx) => {     
        await updateCurrentGameRoundWithCurrentGuess(currentRound, validationResult, tx, unixTimestampInSeconds);
        await addScoreForPlayer(currentPlayer, scoreResult.totalScore, tx);
        await updateGameForNextRound(game, tx);

        // TODO: helper method to perform "domain actions" like this?
        if (unixTimestampInSeconds) {
            updateNextRoundsLastGuessTimestamp(nextRound.id, unixTimestampInSeconds, tx);
        }
    });          
}

async function triggerEndGame(game: DbActiveGameWithRoundsAndPlayers): Promise<void> {
    await db.transaction(async (tx) => {
        await DeleteGameByIdCommand(game.id, tx);
    });
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

async function isPlayersTurn(currentPlayer: DbGamePlayer): Promise<boolean> {
    const currentUser = await getCurrentUserOrCrash();
    
    return currentUser.accountId == currentPlayer.accountId;
}

async function updateCurrentGameRoundWithCurrentGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult, tx: DbOrTransaction, unixTimestampInSeconds?: number) {
    await tx.update(GameRoundTable)
        .set({
            currentGuessIndex: currentRound.currentGuessIndex + 1,
            guesses: [...currentRound.guesses, {
                position: currentRound.currentGuessIndex,
                evaluatedLetters: validationResult.validatedWord
            }],
            evaluatedLetters: [...currentRound.evaluatedLetters, ...validationResult.newLetters],
            lastGuessUnixUtcTimestamp_InSeconds: currentRound.lastGuessUnixUtcTimestamp_InSeconds ? unixTimestampInSeconds : null
        })
        .where(eq(GameRoundTable.id, currentRound.id));        
}

async function updateNextRoundsLastGuessTimestamp(nextRoundId: string, unixTimestampInSeconds: number, tx: DbOrTransaction) {
    await tx.update(GameRoundTable)
        .set({
            lastGuessUnixUtcTimestamp_InSeconds: unixTimestampInSeconds
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

async function addScoreForPlayer(player: DbGamePlayer, score: number, tx: DbOrTransaction) {
  await tx.update(GamePlayerTable)
    .set({
      score: player.score + score,
    })
    .where(
      and(
        eq(GamePlayerTable.accountId, player.accountId),
        eq(GamePlayerTable.gameId, player.gameId)
      )
    );
}