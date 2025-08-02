import { supportedLanguages } from "@/features/i18n/languages";
import { pgEnum } from "drizzle-orm/pg-core";

export const supportedLanguageEnum = pgEnum('supported_language', supportedLanguages);

