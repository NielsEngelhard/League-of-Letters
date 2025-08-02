import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { gameModeEnum } from "./enum/game-mode";
import { DbActiveGameRound, ActiveGameRoundTable } from "./active-game-round";
import { ActiveGamePlayerTable, DbActiveGamePlayer } from "./active-game-player";

export const ActiveGameTable = pgTable("active_game", {
    id: text().primaryKey(),        
    nRounds: integer().notNull(),
    nGuessesPerRound: integer().notNull().default(6),
    gameMode: gameModeEnum().notNull(),
    wordLength: integer().notNull(),    
    currentRoundIndex: integer().notNull().default(1),    
    createdAt,
});
export type DbActiveGame = InferSelectModel<typeof ActiveGameTable>;

export type DbActiveGameWithRoundsAndPlayers = DbActiveGame & {
  rounds: DbActiveGameRound[];
  players: DbActiveGamePlayer[];
};

export const gameRelations = relations(ActiveGameTable, ({ many }) => ({
  rounds: many(ActiveGameRoundTable),
  players: many(ActiveGamePlayerTable)
}));