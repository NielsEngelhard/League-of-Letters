"use server"

import { db } from "@/drizzle/db";
import { officialWordsLanguageTableMap } from "@/drizzle/schema";
import { SupportedLanguage } from "@/features/i18n/languages";
import { eq, sql } from "drizzle-orm";

export default async function GetWordsCommand(wordLength: number, amount: number, language: SupportedLanguage): Promise<string[]> {
    var list: string[] = [];

    const languageTable = officialWordsLanguageTableMap[language]; 

    const dbResult = await db
        .select()
        .from(languageTable)
        .where(eq(languageTable.length, wordLength))
        .orderBy(sql`RANDOM()`)
        .limit(amount);

    if (dbResult.length != amount) {
        throw Error(`DB ERROR: Not enough words available for language ${language} | Amount of words '${amount}' | Length: ${wordLength}`);
    }

    return dbResult.map(r => r.word);
}