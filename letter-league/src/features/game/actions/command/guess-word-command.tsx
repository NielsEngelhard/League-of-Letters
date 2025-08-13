"use server";

import { db } from "@/drizzle/db";
import { CalculateScoreResult } from "@/features/score/score-models";
import { EvaluatedLetter, EvaluatedWord } from "@/features/word/word-models";
import { RoundTransitionData } from "../../game-models";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, DbActiveGame, DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers, GameMode } from "@/drizzle/schema";
import GetAuthSessionBySecreyKeyRequest from "@/features/auth/actions/request/get-auth-session-by-secret-key";
import { DetailedValidationResult, WordValidator } from "@/features/word/util/word-validator/word-validator";
import DeleteGameByIdCommand from "./delete-game-by-id-command";
import { and, eq } from "drizzle-orm";
import { TurnTrackerAlgorithm } from "../../util/algorithm/turn-tracker-algorithm/turn-tracker";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { ScoreCalculator } from "@/features/score/score-calculator/score-calculator";

export interface GuessWordCommandInput {
    gameId: string;
    word: string;
    secretKey: string;
}

export interface GuessWordResponse {
    userId: string;
    guessResult: EvaluatedWord;
    newLetters: EvaluatedLetter[];
    scoreResult: CalculateScoreResult;
    roundTransitionData?: RoundTransitionData;
}

export async function GuessWordCommand(command: GuessWordCommandInput): Promise<ServerResponse<GuessWordResponse>> {    
    const game = await getGame(command.gameId);
    
    let currentPlayer = getCurrentPlayer(game);

    debugger;
    const isThisPlayersTurn = await isPlayersTurn(command.secretKey, currentPlayer);
    if (!isThisPlayersTurn) {
        return ServerResponseFactory.error("Not your turn!");
    }

    let currentRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex);
    if (!currentRound) throw Error(`GUESS WORD: INVALID STATE could not find round`);
    
    const validationResult = WordValidator.validateAndFilter(command.word, currentRound.word.word, currentRound.evaluatedLetters);

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

function getCurrentPlayer(game: DbActiveGameWithRoundsAndPlayers): DbGamePlayer {
    if (game.players.length == 1) return game.players[0];

    const playerId = TurnTrackerAlgorithm.determineWhosTurnItIs(game.players.map(p => p.id), game.currentRoundIndex, 1);

    return game.players.find(p => p.id == playerId)!;
}

async function updateCurrentGameState(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound, validationResult: DetailedValidationResult, scoreResult: CalculateScoreResult, currentPlayer: DbGamePlayer): Promise<GuessWordResponse> {
    const roundMaxGuessesReached = (currentRound.currentGuessIndex + 1) >= game.nGuessesPerRound;
    const endCurrentRound = roundMaxGuessesReached || validationResult.allCorrect;
    const endGame = endCurrentRound && (game.currentRoundIndex >= game.nRounds);

    const currentGuess: EvaluatedWord = {
        position: currentRound.currentGuessIndex,
        evaluatedLetters: validationResult.validatedWord
    }

    if (endGame) {
        currentPlayer.score += scoreResult.totalScore;
        currentRound.guesses.push(currentGuess);
        await triggerEndGame(game);
    } else if (endCurrentRound) {
        await triggerNextRound(currentRound, validationResult, currentPlayer, scoreResult, game);
    } else {
        await triggerNextGuess(currentRound, validationResult, currentPlayer, scoreResult);
    }

    return {
        userId: currentPlayer.userId,
        guessResult: currentGuess,
        newLetters: validationResult.newLetters,
        scoreResult: scoreResult,
        roundTransitionData: endCurrentRound ? {
            isEndOfGame: endGame,
            currentWord: currentRound.word.word,
            nextRoundFirstLetter: endCurrentRound ? "Z" : undefined,
        } : undefined
    };    
}

async function triggerNextGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, scoreResult: CalculateScoreResult) {
    await db.transaction(async (tx) => {
        await updateGameRoundWithCurrentGuess(currentRound, validationResult);
        await addScoreForPlayer(currentPlayer, scoreResult.totalScore);
    });          
}

async function triggerNextRound(currentRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, scoreResult: CalculateScoreResult, game: DbActiveGame) {
    await db.transaction(async (tx) => {        
        await updateGameRoundWithCurrentGuess(currentRound, validationResult);
        await addScoreForPlayer(currentPlayer, scoreResult.totalScore);
        await updateGameForNextRound(game);
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

async function isPlayersTurn(secretKey: string, currentPlayer: DbGamePlayer): Promise<boolean> {
    const authSession = await GetAuthSessionBySecreyKeyRequest(secretKey);
    
    return authSession?.id == currentPlayer.userId;
}

async function updateGameRoundWithCurrentGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult) {
    await db.update(GameRoundTable)
        .set({
            currentGuessIndex: currentRound.currentGuessIndex + 1,
            guesses: [...currentRound.guesses, {
                position: currentRound.currentGuessIndex,
                evaluatedLetters: validationResult.validatedWord
            }],
            evaluatedLetters: [...currentRound.evaluatedLetters, ...validationResult.newLetters],
        })
        .where(eq(GameRoundTable.id, currentRound.id));        
}

async function updateGameForNextRound(game: DbActiveGame) {
    await db.update(ActiveGameTable)
        .set({
            currentRoundIndex: game.currentRoundIndex + 1
        })
        .where(eq(ActiveGameTable.id, game.id));    
}

async function addScoreForPlayer(player: DbGamePlayer, score: number) {
  await db.update(GamePlayerTable)
    .set({
      score: player.score + score,
    })
    .where(
      and(
        eq(GamePlayerTable.userId, player.userId),
        eq(GamePlayerTable.gameId, player.gameId)
      )
    );
}