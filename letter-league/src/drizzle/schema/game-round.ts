import { integer, jsonb, pgTable, text, unique } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { id } from "../schema-helpers";
import { ActiveGameTable } from "./active-game";
import { EvaluatedLetter, EvaluatedWord, WordState } from "@/features/word/word-models";

export const GameRoundTable = pgTable("game_round", {
    id,
    gameId: text().references(() => ActiveGameTable.id, { onDelete: 'cascade' }).notNull(),
    roundNumber: integer().notNull(),
    currentGuessIndex: integer().notNull().default(1),
    word: jsonb('word').$type<WordState>().notNull(),
    guesses: jsonb('guesses').$type<EvaluatedWord[]>().notNull().default([]),
    evaluatedLetters: jsonb('evaluated_letters').$type<EvaluatedLetter[]>().notNull().default([]),
}, (t) => [
  unique().on(t.gameId, t.roundNumber)
]);

export type DbGameRound = InferSelectModel<typeof GameRoundTable>;

export const gameRoundRelations = relations(GameRoundTable, ({ one }) => ({
  game: one(ActiveGameTable, {
    fields: [GameRoundTable.gameId],
    references: [ActiveGameTable.id]
  })
}));
