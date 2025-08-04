import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";

export const AuthSessionTable = pgTable("auth_session", {
    id, // ID is public visible and for other players to see
    username: text().notNull(),
    secretKey: text().notNull(), // Secret key is only for this player to e.g. submit guesses with a unique key
    createdAt,
});

export type DbAuthSession = InferSelectModel<typeof AuthSessionTable>;
