import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { ActiveGameTable } from "./active-game";
import { id } from "../schema-helpers";
import { AuthSessionTable } from "./auth-session";
import { OnlineLobbyTable } from "./online-lobby";

export const GamePlayerTable = pgTable("game_player", {
    id,
    userId: uuid().references(() => AuthSessionTable.id, { onDelete: 'cascade' }).notNull(),
    gameId: text().references(() => ActiveGameTable.id, { onDelete: 'cascade' }),
    lobbyId: text().references(() => OnlineLobbyTable.id, { onDelete: 'cascade' }),
    username: text(),
    score: integer().notNull().default(0),
});

export type DbGamePlayer = InferSelectModel<typeof GamePlayerTable>;

export const gamePlayerRelations = relations(GamePlayerTable, ({ one }) => ({
  game: one(ActiveGameTable, {
    fields: [GamePlayerTable.gameId],
    references: [ActiveGameTable.id]
  }),
  onlineLobby: one(OnlineLobbyTable, {
    fields: [GamePlayerTable.lobbyId],
    references: [OnlineLobbyTable.id]
  })  
}));