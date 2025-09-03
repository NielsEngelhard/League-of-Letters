import { SupportedLanguage } from "@/features/i18n/languages";
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export function OfficialWordsTable(language: SupportedLanguage) {
  return pgTable(`${language}_words`, {
    word: text().notNull().unique().primaryKey(),
    length: integer().notNull()
  });
}

// Tables
export const NlWordsTable = OfficialWordsTable("nl");
export const EnWordsTable = OfficialWordsTable("en");
export const DeWordsTable = OfficialWordsTable("de");
export const FrWordsTable = OfficialWordsTable("fr");

export const officialWordsLanguageTableMap = {
  "nl": NlWordsTable,
  "en": EnWordsTable,
  "de": DeWordsTable,
  "fr": FrWordsTable,
};
