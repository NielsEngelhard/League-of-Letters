import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { supportedLanguages } from "@/features/i18n/languages";
import { seedWordListInDb } from "@/features/word/util/script/archive/seed-word-list-in-db";
import { drizzle } from "drizzle-orm/node-postgres";

export async function seedWordsInDatabase(dbConnectionString: string, onlySeedSmallDutchSubset: boolean) { // Small subset for dev/tst or full word lists (all)
    console.log(`🌱 Start seeding word lists onlySeedSmallDutchSubset=${onlySeedSmallDutchSubset}`);

    const db = drizzle(dbConnectionString) as DbOrTransaction;

    for(let i=0; i<supportedLanguages.length; i++) {
        const languageToSeed = supportedLanguages[i];

        if (onlySeedSmallDutchSubset && languageToSeed != "nl") {
            continue;
        }

        const fileName = onlySeedSmallDutchSubset ? `${languageToSeed}-clean-words-small.txt` : `${languageToSeed}-clean-words-full.txt`; 

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
