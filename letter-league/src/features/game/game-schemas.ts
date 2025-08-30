import { gameModes } from "@/drizzle/schema";
import { z } from "zod";
import { MAX_GUESSES_PER_ROUND, MAX_TOTAL_ROUNDS, MAX_WORD_LENGTH, MIN_GUESSES_PER_ROUND, MIN_TOTAL_ROUNDS, MIN_WORD_LENGTH } from "./game-constants";
import { isValidGameId } from "./util/game-id-generator";
import { connectionStatusses } from "../realtime/realtime-models";
import { supportedLanguages } from "../i18n/languages";

export const createGamePlayerSchema = z.object({
    accountId: z.string().nonempty(),
    username: z.string().nonempty(),
    color: z.string(),
    connectionStatus: z.enum(connectionStatusses).optional(),
});
export type CreateGamePlayerSchema = z.infer<typeof createGamePlayerSchema>;

export const createGameSchema = z.object({
    wordLength: z.number().min(MIN_WORD_LENGTH).max(MAX_WORD_LENGTH),
    totalRounds: z.number().min(MIN_TOTAL_ROUNDS).max(MAX_TOTAL_ROUNDS),
    guessesPerRound: z.number().min(MIN_GUESSES_PER_ROUND).max(MAX_GUESSES_PER_ROUND),
    players: z.array(createGamePlayerSchema).optional(),
    gameMode: z.enum(gameModes),
    nSecondsPerGuess: z.number().max(300).optional(),
    gameId: z.string().optional(),
    withStartingLetter: z.boolean().optional(),
    language: z.enum(supportedLanguages)
}).refine((data) => {
    if (data.gameMode == "online") {
        return data.players && data.players.length >= 2;
    } 

    return true;
}, {
    message: "Online games require at least 2 players",
    path: ["players"]
}).refine((data) => {
    if (data.gameMode == "online") {
        return isValidGameId(data.gameId);
    }

    return true;
},{
    message: "GameId must be present for online games",
    path: ["gameId"]    
});
export type CreateGameSchema = z.infer<typeof createGameSchema>;