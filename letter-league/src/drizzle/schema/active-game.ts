import { integer, pgTable, text, boolean, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { DbGameRound, GameRoundTable } from "./game-round";
import { GamePlayerTable, DbGamePlayer } from "./game-player";
import { AccountTable, gameModeEnum } from "../schema";

export const ActiveGameTable = pgTable("active_game", {
    id: text().primaryKey(),        
    nRounds: integer().notNull(),
    nGuessesPerRound: integer().notNull().default(6),
    gameMode: gameModeEnum().notNull(),
    wordLength: integer().notNull(),    
    currentRoundIndex: integer().notNull().default(1),    
    gameIsOver: boolean().notNull().default(false),
    nSecondsPerGuess: integer(), // Undefined/null = infinite time
    hostAccountId: uuid()
      .references(() => AccountTable.id, { onDelete: "cascade" })
      .notNull(),
    createdAt,
});
export type DbActiveGame = InferSelectModel<typeof ActiveGameTable>;

export type DbActiveGameWithRoundsAndPlayers = DbActiveGame & {
  rounds: DbGameRound[];
  players: DbGamePlayer[];
};

export const gameRelations = relations(ActiveGameTable, ({ many }) => ({
  rounds: many(GameRoundTable),
  players: many(GamePlayerTable)
}));