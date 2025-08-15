import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { DbOnlineLobbyPlayer, OnlineLobbyPlayerTable } from "./online-lobby-player";
import { AccountTable } from "./account";

export const OnlineLobbyTable = pgTable("online_lobby", {
    id: text().primaryKey(),
    userHostId: uuid().references(() => AccountTable.id, { onDelete: 'cascade' }).notNull(),
    createdAt,
});
export type DbOnlineLobby = InferSelectModel<typeof OnlineLobbyTable>;

export type DbOnlineLobbyWithPlayers = DbOnlineLobby & {
  players: DbOnlineLobbyPlayer[];
};

export const onlineLobbyRelations = relations(OnlineLobbyTable, ({ many }) => ({
  players: many(OnlineLobbyPlayerTable)
}));
