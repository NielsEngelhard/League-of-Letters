import { GameMode } from "@/drizzle/schema";
import { z } from "zod";
import { MAX_GUESSES_PER_ROUND, MAX_TOTAL_ROUNDS, MAX_WORD_LENGTH, MIN_GUESSES_PER_ROUND, MIN_TOTAL_ROUNDS, MIN_WORD_LENGTH } from "./game-constants";
import { isValidGameId } from "./util/game-id-generator";

export const createGamePlayerSchema = z.object({
    userId: z.string().nonempty(),
    username: z.string().nonempty(),    
});
export type CreateGamePlayerSchema = z.infer<typeof createGamePlayerSchema>;

export const createGameSchema = z.object({
    wordLength: z.number().min(MIN_WORD_LENGTH).max(MAX_WORD_LENGTH),
    totalRounds: z.number().min(MIN_TOTAL_ROUNDS).max(MAX_TOTAL_ROUNDS),
    guessesPerRound: z.number().min(MIN_GUESSES_PER_ROUND).max(MAX_GUESSES_PER_ROUND),
    players: z.array(createGamePlayerSchema).optional(),
    gameMode: z.enum(GameMode),
    gameId: z.string().optional()
}).refine((data) => {
    if (data.gameMode == GameMode.Online) {
        return data.players && data.players.length >= 2;
    } 

    return true;
}, {
    message: "Online games require at least 2 players",
    path: ["players"]
}).refine((data) => {
    if (data.gameMode == GameMode.Online) {
        return isValidGameId(data.gameId);
    }

    return true;
},{
    message: "GameId must be present for online games",
    path: ["gameId"]    
});
export type CreateGameSchema = z.infer<typeof createGameSchema>;