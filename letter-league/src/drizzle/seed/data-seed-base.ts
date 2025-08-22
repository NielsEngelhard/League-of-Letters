import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { SupportedLanguage } from "@/features/i18n/languages";
import { seedWordListInDb } from "@/features/word/util/script/archive/seed-word-list-in-db";
import { drizzle } from "drizzle-orm/node-postgres";

export async function seedWordsInDatabase(smallSubset: boolean) { // Small subset for dev/tst or full word lists (all)
    console.log(`🌱 Start seeding word lists smallSubset=${smallSubset}`);

    const dbConnectionString: string = "postgresql://postgres:kaas@localhost:5432/letter-league";

    const db = drizzle(dbConnectionString) as DbOrTransaction;

    const languagesToSeed: SupportedLanguage[] = [
        "nl"
    ]

    for(var i=0; i<languagesToSeed.length; i++) {
        const languageToSeed = languagesToSeed[i];

        const fileName = smallSubset ? `${languageToSeed}-clean-words-small.txt` : `${languageToSeed}-clean-words-full.txt`; 

        console.log(`🌱 Seeding list for language '${languageToSeed}' with file name '${fileName}'`);
        try {                                    
            // There should be a txt file with this name for the language (in this standard)
            const filePath = `public/word-lists/${languageToSeed}/${fileName}`;

            await seedWordListInDb(
                filePath,
                languageToSeed,
                db
            );                

            console.log(`✅ Successfully seeded ${languageToSeed}`);
        } catch(error) {
            console.error(`❌ Seeding of ${languageToSeed} failed:`, error);
        }
    }
}
