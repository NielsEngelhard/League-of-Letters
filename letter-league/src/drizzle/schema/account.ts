import { integer, pgTable, text, boolean } from "drizzle-orm/pg-core";
import { createdAt, id } from "../schema-helpers";
import { InferSelectModel } from "drizzle-orm";
import { DbAccountSettings } from "./account-settings";
import { supportedLanguageEnum } from "./enum/supported-language";

export const AccountTable = pgTable("account", {
    id,
    username: text().notNull(),
    email: text().notNull(),
    password: text().notNull(),
    salt: text().notNull(),
    favouriteWord: text(),
    nGamesPlayed: integer().notNull().default(0),
    highestScoreAchieved: integer().notNull().default(0),
    colorHex: text().notNull(),
    isGuestAccount: boolean().notNull().default(false),
    language: supportedLanguageEnum().notNull(),
    createdAt,
});

export type DbAccount = InferSelectModel<typeof AccountTable>;

export type AccountWithSettings = DbAccount & {
  settings: DbAccountSettings;
};