import { integer, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { DbGameRound, GameRoundTable } from "./game-round";
import { GamePlayerTable, DbGamePlayer } from "./game-player";
import { gameModeEnum } from "../schema";

export const ActiveGameTable = pgTable("active_game", {
    id: text().primaryKey(),        
    nRounds: integer().notNull(),
    nGuessesPerRound: integer().notNull().default(6),
    gameMode: gameModeEnum().notNull(),
    wordLength: integer().notNull(),    
    currentRoundIndex: integer().notNull().default(1),    
    gameIsOver: boolean().notNull().default(false),
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