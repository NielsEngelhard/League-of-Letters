import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { GamePlayerTable, DbGamePlayer } from "./game-player";
import { AuthSessionTable } from "./auth-session";

export const OnlineLobbyTable = pgTable("online_lobby", {
    id: text().primaryKey(),
    userHostId: uuid().references(() => AuthSessionTable.id, { onDelete: 'cascade' }).notNull(),
    createdAt,
});
export type DbOnlineLobby = InferSelectModel<typeof OnlineLobbyTable>;

export type DbOnlineLobbyWithPlayers = DbOnlineLobby & {
  players: DbGamePlayer[];
};

export const onlineLobbyRelations = relations(OnlineLobbyTable, ({ many }) => ({
  players: many(GamePlayerTable)
}));