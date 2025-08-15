import { themeOptions, wordInputOptions } from "@/features/user/profile-models";
import { pgEnum } from "drizzle-orm/pg-core";

export const wordInputEnum = pgEnum("word_input_setting", wordInputOptions);
export const themeEnum = pgEnum("theme_setting", themeOptions);