import { integer, pgTable, text, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { ActiveGameTable } from "./active-game";
import { connectionStatusEnum } from "./enum/connection-status";
import { AccountTable } from "./account";

export const GamePlayerTable = pgTable(
  "game_player",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid()
      .references(() => AccountTable.id, { onDelete: "cascade" })
      .notNull(),
    gameId: text()
      .references(() => ActiveGameTable.id, { onDelete: "cascade" })
      .notNull(),
    username: text(),
    connectionStatus: connectionStatusEnum().notNull().default("empty"),
    score: integer().notNull().default(0),
    position: integer().notNull().default(1),
  },
  (table) => ({
    gameId_position_unique: uniqueIndex("game_player_gameId_position_unique").on(
      table.gameId,
      table.position
    ),
  })
);

export type DbGamePlayer = InferSelectModel<typeof GamePlayerTable>;

export const gamePlayerRelations = relations(GamePlayerTable, ({ one }) => ({
  game: one(ActiveGameTable, {
    fields: [GamePlayerTable.gameId],
    references: [ActiveGameTable.id]
  }),
}));