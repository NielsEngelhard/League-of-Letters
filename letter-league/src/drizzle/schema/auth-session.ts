import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";
import { AccountTable } from "./account";

export const AuthSessionTable = pgTable("auth_session", {
    id, // ID is public visible and for other players to see
    username: text().notNull(),
    secretKey: text().notNull(), // Secret key is only for this player to e.g. submit guesses with a unique key
    isGuestSession: boolean(),
    accountId: text().references(() => AccountTable.id, { onDelete: "cascade" }),
    createdAt,
});

export type DbAuthSession = InferSelectModel<typeof AuthSessionTable>;
