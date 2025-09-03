"use server"

import { supportedLanguages } from "@/features/i18n/languages";
import { LanguageWordCount } from "../../word-models";
import { db } from "@/drizzle/db";
import { officialWordsLanguageTableMap } from "@/drizzle/schema";
import { sql } from "drizzle-orm";

export default async function GetWordCountPerLanguage(): Promise<LanguageWordCount[]> {
    const countPromises = supportedLanguages.map(async (language) => {
        const LanguageTable = officialWordsLanguageTableMap[language];
        
        const [{ count }] = await db
            .select({ count: sql<number>`count(*)` })
            .from(LanguageTable);

        return {
            language: language,
            wordCount: count
        };
    });

    const result = await Promise.all(countPromises);
    
    return result;
}

// export async function GetWordCountPerLanguageAlternative(): Promise<LanguageWordCount[]> {
//     const subqueries = supportedLanguages.map(language => 
//         `(SELECT COUNT(*) FROM ${officialWordsLanguageTableMap[language]._.name}) as ${language}_count`
//     ).join(', ');

//     const query = sql.raw(`SELECT ${subqueries}`);
//     const [result] = await db.execute(query) as any[];

//     return supportedLanguages.map(language => ({
//         language,
//         wordCount: result[`${language}_count`]
//     }));
// }