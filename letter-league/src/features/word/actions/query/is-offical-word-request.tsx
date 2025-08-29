"use server"

import { db } from "@/drizzle/db";
import { officialWordsLanguageTableMap } from "@/drizzle/schema";
import { SupportedLanguage } from "@/features/i18n/languages";
import { eq, sql } from "drizzle-orm";

interface IsOfficalWordRequestData {
    word: string;
    language: SupportedLanguage;
}

export async function IsOfficialWordRequestOptimized(data: IsOfficalWordRequestData): Promise<boolean> {
  try {
    const languageTable = officialWordsLanguageTableMap[data.language as keyof typeof officialWordsLanguageTableMap];
    
    if (!languageTable) {
      throw new Error(`Unsupported language: ${data.language}`);
    }

    // Use count for better performance on large tables
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(languageTable)
    .where(sql`${languageTable.word} ILIKE ${data.word}`);

    return count > 0;
  } catch (error) {
    console.error('Error checking official word:', error);
    return false;
  }
}