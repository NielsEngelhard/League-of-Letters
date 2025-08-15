import { pgTable, text } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";
import { DbAccountSettings } from "./account-settings";

export const AccountTable = pgTable("account", {
    id,
    username: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    salt: text().notNull(),
    createdAt,
});

export type DbAccount = InferSelectModel<typeof AccountTable>;

export type AccountWithSettings = DbAccount & {
  settings: DbAccountSettings;
};