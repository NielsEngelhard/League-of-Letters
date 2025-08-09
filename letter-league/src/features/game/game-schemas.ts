import { GameMode } from "@/drizzle/schema";
import { z } from "zod";
import { MAX_GUESSES_PER_ROUND, MAX_TOTAL_ROUNDS, MAX_WORD_LENGTH, MIN_GUESSES_PER_ROUND, MIN_TOTAL_ROUNDS, MIN_WORD_LENGTH } from "./game-constants";

export const createGameSchema = z.object({
    wordLength: z.number().min(MIN_WORD_LENGTH).max(MAX_WORD_LENGTH),
    totalRounds: z.number().min(MIN_TOTAL_ROUNDS).max(MAX_TOTAL_ROUNDS),
    guessesPerRound: z.number().min(MIN_GUESSES_PER_ROUND).max(MAX_GUESSES_PER_ROUND),
    gameMode: z.enum(GameMode)
});
export type CreateGameSchema = z.infer<typeof createGameSchema>;