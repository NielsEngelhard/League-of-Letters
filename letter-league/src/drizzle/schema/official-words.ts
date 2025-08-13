import { SupportedLanguage } from "@/features/i18n/languages";
import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, integer } from "drizzle-orm/pg-core";

export function createOfficialWordsTable(language: SupportedLanguage) {
  return pgTable(`${language}_words`, {
    word: text().notNull().unique().primaryKey(),
    length: integer().notNull()
  });
}

// Tables
export const NlWordsTable = createOfficialWordsTable("nl");
// export const EnWordsTable = createOfficialWordsTable("en");

export const officialWordsLanguageTableMap = {
  "nl": NlWordsTable,
//   "en": EnWordsTable,
};
export type NlWordsTableType = InferSelectModel<typeof NlWordsTable>;