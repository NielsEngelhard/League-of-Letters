import { integer, jsonb, pgTable, text, unique } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { id } from "../schema-helpers";
import { ActiveGameTable } from "./active-game";
import { EvaluatedLetter, WordState } from "@/features/word/word-models";
import { UserGuess } from "@/features/user/user-models";

export const ActiveGameRoundTable = pgTable("active_game_round", {
    id,
    gameId: text().references(() => ActiveGameTable.id, { onDelete: 'cascade' }).notNull(),
    roundNumber: integer().notNull(),
    currentGuessIndex: integer().notNull().default(1),
    word: jsonb('word').$type<WordState>().notNull(),
    guesses: jsonb('guesses').$type<UserGuess[]>().notNull().default([]),
    evaluatedLetters: jsonb('evaluated_letters').$type<EvaluatedLetter[]>().notNull().default([]),
}, (t) => [
  unique().on(t.gameId, t.roundNumber)
]);

export type DbActiveGameRound = InferSelectModel<typeof ActiveGameRoundTable>;

export const gameRoundRelations = relations(ActiveGameRoundTable, ({ one }) => ({
  game: one(ActiveGameTable, {
    fields: [ActiveGameRoundTable.gameId],
    references: [ActiveGameTable.id]
  })
}));
