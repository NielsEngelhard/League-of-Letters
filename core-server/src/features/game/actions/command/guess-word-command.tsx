"use server";

import { db } from "@/drizzle/db";
import { EvaluatedWord } from "@/features/word/word-models";
import { RoundTransitionData } from "../../game-models";
import { GamePlayerTable, GameRoundTable, ActiveGameTable, DbActiveGame, DbGamePlayer, DbGameRound, DbActiveGameWithRoundsAndPlayers } from "@/drizzle/schema";
import { DetailedValidationResult, WordValidator } from "@/features/word/util/word-validator/word-validator";
import { and, eq } from "drizzle-orm";
import { TurnTrackerAlgorithm } from "../../util/algorithm/turn-tracker-algorithm/turn-tracker";
import { ServerResponse, ServerResponseFactory } from "@/lib/response-handling/response-factory";
import { EmitGuessWordRealtimeEvent } from "@/features/realtime/realtime-api-adapter";
import { sortDbPlayerOnPositionAndGetUserIds } from "../../util/player-sorting";
import { AuthenticateOrRedirect_Server } from "@/features/auth/current-user";
import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { GameMapper } from "../../game-mapper";
import { SupportedLanguage } from "@/features/i18n/languages";
import { IsOfficialWordRequestOptimized } from "@/features/word/actions/query/is-offical-word-request";
import { GetNextGuessExpiresUtcDate } from "../../util/timed-game-util";
import { getCurrentUtcDate } from "@/lib/time-util";

export interface GuessWordCommandInput {
    gameId: string;
    word: string;
    language: SupportedLanguage;
}

export interface GuessWordResponse {
    gameId: string;
    accountId: string;
    guessResult?: EvaluatedWord;
    score: number;
    unguessedMisplacedLetters: string[]; // hard to determine in client with public info, so determined easily in the server
    roundTransitionData?: RoundTransitionData;
    nextGuessMaxUtcDate?: Date;    
}

export async function GuessWordCommand(command: GuessWordCommandInput): Promise<ServerResponse<GuessWordResponse>> {    
    const guessIsValidWord = await GuessIsValidWord(command.word, command.language);
    if (!guessIsValidWord) {
        return ServerResponseFactory.error("Invalid word");
    }
    
    const game = await getGame(command.gameId);

    const currentRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex);
    if (!currentRound) throw Error(`GUESS WORD: INVALID STATE could not find round`);

    // For timed games check if guess is within time
    const guessIsWithinTime = GuessIsWithinTime(game, currentRound);
    if (!guessIsWithinTime)
        return ServerResponseFactory.error("Out of time :(");

    const currentPlayer = getPlayerWhosTurnItIs(game, currentRound);

    const isThisPlayersTurn = await isPlayersTurn(currentPlayer);
    if (!isThisPlayersTurn) {
        return ServerResponseFactory.error("Not your turn!");
    }
    
    const previouslyMisplacedLetters = currentRound.previouslyMisplacedLetters;

    const validationResult = WordValidator.validate({
        actualWordState: currentRound.word,
        currentGuessIndex: currentRound.currentGuessIndex,
        guess: command.word,
        previouslyGuessedMisplacedLetters: previouslyMisplacedLetters
    });

    const currentGuess = await updateCurrentGameState(game, currentRound, validationResult, currentPlayer);

    if (game.gameMode == "online") {
        await EmitGuessWordRealtimeEvent(game.id, currentGuess);
    }

    return ServerResponseFactory.success(currentGuess);
}

function getPlayerWhosTurnItIs(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound): DbGamePlayer {
    if (game.players.length == 1) return game.players[0];

    const sortedPlayerIds = sortDbPlayerOnPositionAndGetUserIds(game.players);

    const resp = TurnTrackerAlgorithm.determineWhosTurnItIs({
        playerIdsInOrder: sortedPlayerIds,
        currentRound: game.currentRoundIndex,
        currentGuess: currentRound.currentGuessIndex,
    });

    return game.players.find(p => p.accountId == resp.currentPlayerAccountId)!;
}

async function updateCurrentGameState(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer): Promise<GuessWordResponse> {
    const roundMaxGuessesReached = (currentRound.currentGuessIndex) >= game.nGuessesPerRound;
    const endCurrentRound = roundMaxGuessesReached || validationResult.allCorrect;
    const endGame = endCurrentRound && (game.currentRoundIndex >= game.nRounds);

    const currentGuess: EvaluatedWord = {
        position: currentRound.currentGuessIndex,
        evaluatedLetters: validationResult.evaluatedGuess
    }

    const nextRound = game.rounds.find(g => g.roundNumber == game.currentRoundIndex+1);

    const nextGuessMaxUtcDate = GetNextGuessExpiresUtcDate(game.nSecondsPerGuess, currentRound.wordLength);

    if (endGame) {
        currentRound.guesses.push(currentGuess);
        await triggerEndGame(game, currentPlayer, validationResult.score);
    } else if (endCurrentRound) {        
        await triggerNextRound(currentRound, nextRound!, validationResult, currentPlayer, game, nextGuessMaxUtcDate);
    } else {
        await triggerNextGuess(currentRound, validationResult, currentPlayer, nextGuessMaxUtcDate);
    }

    return {
        gameId: game.id,
        accountId: currentPlayer.accountId,
        guessResult: currentGuess,
        score: validationResult.score,
        roundTransitionData: endCurrentRound ? {
            isEndOfGame: endGame,
            currentWord: {
                word: currentRound.word.originalWord,
                definition: currentRound.word.definition
            },
            nextRoundFirstLetter: nextRound?.word.strippedWord[0],
        } : undefined,
        unguessedMisplacedLetters: GameMapper.FilterMisplacedLettersForCurrentWord(validationResult.previouslyGuessedMisplacedLetters, currentRound.word),
        nextGuessMaxUtcDate: nextGuessMaxUtcDate
    };    
}

async function triggerNextGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, nextGuessMaxUtcDate?: Date) {
    await db.transaction(async (tx) => {   
        await updateCurrentGameRoundWithCurrentGuess(currentRound, validationResult, tx, nextGuessMaxUtcDate);
        await addScoreForPlayer(currentPlayer, validationResult.score, tx);
    });          
}

async function triggerNextRound(currentRound: DbGameRound, nextRound: DbGameRound, validationResult: DetailedValidationResult, currentPlayer: DbGamePlayer, game: DbActiveGame, nextGuessMaxUtcDate?: Date) {
    await db.transaction(async (tx) => {     
        await updateCurrentGameRoundWithCurrentGuess(currentRound, validationResult, tx, nextGuessMaxUtcDate);
        await addScoreForPlayer(currentPlayer, validationResult.score, tx);
        await updateGameForNextRound(game, tx);

        if (nextGuessMaxUtcDate) {
            updateNextRoundsMaxGuessUtcDate(nextRound.id, nextGuessMaxUtcDate, tx);
        }
    });          
}

async function triggerEndGame(game: DbActiveGameWithRoundsAndPlayers, currentPlayer: DbGamePlayer, score: number): Promise<void> {
    // Set game is over so it can be found back for a while    
    await db.transaction(async (tx) => {   
        // Set game to game over  
        await tx.update(ActiveGameTable).set({
            gameIsOver: true
        }).where(eq(ActiveGameTable.id, game.id));

        await addScoreForPlayer(currentPlayer, score, tx);
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
    const currentUser = await AuthenticateOrRedirect_Server();
    
    return currentUser.accountId == currentPlayer.accountId;
}

async function updateCurrentGameRoundWithCurrentGuess(currentRound: DbGameRound, validationResult: DetailedValidationResult, tx: DbOrTransaction, currentGuessMaxUtcDate?: Date) {
    await tx.update(GameRoundTable)
        .set({
            currentGuessIndex: currentRound.currentGuessIndex + 1,
            guesses: [...currentRound.guesses, {
                position: currentRound.currentGuessIndex,
                evaluatedLetters: validationResult.evaluatedGuess
            }],
            previouslyMisplacedLetters: validationResult.previouslyGuessedMisplacedLetters,
            currentGuessMaxUtcDate: currentGuessMaxUtcDate,
            word: validationResult.actualWordState            
        })
        .where(eq(GameRoundTable.id, currentRound.id));        
}

async function updateNextRoundsMaxGuessUtcDate(nextRoundId: string, currentGuessMaxUtcDate: Date, tx: DbOrTransaction) {
    await tx.update(GameRoundTable)
        .set({
            currentGuessMaxUtcDate: currentGuessMaxUtcDate
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

async function GuessIsValidWord(word: string, language: SupportedLanguage): Promise<boolean> {
    if (process.env.VALIDATE_GUESS_INPUTS != "true") {
        return true;
    }

    return await IsOfficialWordRequestOptimized({ word: word, language: language });
}

function GuessIsWithinTime(game: DbActiveGameWithRoundsAndPlayers, currentRound: DbGameRound) {
    // For non timed games, guess is always within time
    if (!game.nSecondsPerGuess || !currentRound.currentGuessMaxUtcDate) return true;

    const currentTime = getCurrentUtcDate();
    const deadline = currentRound.currentGuessMaxUtcDate;
    
    return currentTime <= deadline; // Still have time remaining
}