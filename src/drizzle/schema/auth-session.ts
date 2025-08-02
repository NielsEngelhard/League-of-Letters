import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";

export const GuestSessionTable = pgTable("auth_session", {
    id, // ID is public visible and for other players to see
    username: text().notNull(),
    secretKey: // Secret key is only for this player to e.g. submit guesses with a unique key
    createdAt,
});

export type DbGameGuestSession = InferSelectModel<typeof GuestSessionTable>;
