import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { ActiveGameTable } from "./active-game";
import { id } from "../schema-helpers";
import { AuthSessionTable } from "./auth-session";

export const ActiveGamePlayerTable = pgTable("active_game_player", {
    id,
    userId: uuid().references(() => AuthSessionTable.id, { onDelete: 'cascade' }).notNull(),
    gameId: text().references(() => ActiveGameTable.id, { onDelete: 'cascade' }).notNull(),
    username: text(),
    score: integer().notNull().default(0)
});

export type DbActiveGamePlayer = InferSelectModel<typeof ActiveGamePlayerTable>;

export const gamePlayerRelations = relations(ActiveGamePlayerTable, ({ one }) => ({
  game: one(ActiveGameTable, {
    fields: [ActiveGamePlayerTable.gameId],
    references: [ActiveGameTable.id]
  })
}));