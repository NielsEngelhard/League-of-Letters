import { boolean, pgTable, uuid } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { themeEnum, wordInputEnum } from "./enum/settings-enum";
import { AccountTable } from "./account";

export const AccountSettingsTable = pgTable("account_settings", {
    accountId: uuid().primaryKey().references(() => AccountTable.id, { onDelete: "cascade" }),
    wordInput: wordInputEnum().notNull(),
    theme: themeEnum().notNull(),
    enableSoundEffects: boolean().notNull().default(true),
    showKeyboardHints: boolean().notNull().default(true),
    showCompleteCorrect: boolean().notNull().default(false),
    enableBackgroundMusic: boolean().notNull().default(true),
    preFillGuess: boolean().notNull().default(false),
});

export type DbAccountSettings = InferSelectModel<typeof AccountSettingsTable>;

export const accountSettingsRelations = relations(AccountSettingsTable, ({ one }) => ({
  game: one(AccountTable, {
    fields: [AccountSettingsTable.accountId],
    references: [AccountTable.id]
  }),
}));