import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel, relations } from "drizzle-orm";
import { AuthSessionTable } from "./auth-session";
import { OnlineLobbyTable } from "./online-lobby";
import { connectionStatusEnum } from "../schema";

export const OnlineLobbyPlayerTable = pgTable("online_lobby_player", {
    id,
    userId: uuid().references(() => AuthSessionTable.id, { onDelete: 'cascade' }).notNull(),
    lobbyId: text().references(() => OnlineLobbyTable.id, { onDelete: 'cascade' }),
    username: text().notNull().default("anonymous"),
    connectionStatus: connectionStatusEnum().notNull().default("empty"),
    createdAt,
});

export type DbOnlineLobbyPlayer = InferSelectModel<typeof OnlineLobbyPlayerTable>;

export const onlineLobbyPlayerRelations = relations(OnlineLobbyPlayerTable, ({ one }) => ({
  game: one(OnlineLobbyTable, {
    fields: [OnlineLobbyPlayerTable.lobbyId],
    references: [OnlineLobbyTable.id]
  }),
}));
