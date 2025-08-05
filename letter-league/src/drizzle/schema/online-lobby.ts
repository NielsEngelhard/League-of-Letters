import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { createdAt } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";
import { AuthSessionTable } from "./auth-session";
import { ConnectionStatus } from "@/features/realtime/realtime-models";

export const OnlineLobbyTable = pgTable("online_lobby", {
    id: text().primaryKey(),
    userHostId: uuid().references(() => AuthSessionTable.id, { onDelete: 'cascade' }).notNull(),
    players: jsonb('players').$type<DbOnlineLobbyPlayer[]>().notNull().default([]),
    createdAt,
});
export type DbOnlineLobby = InferSelectModel<typeof OnlineLobbyTable>;

export type DbOnlineLobbyPlayer = {
  id: string;
  username: string;
  connectionStatus: ConnectionStatus;
}
