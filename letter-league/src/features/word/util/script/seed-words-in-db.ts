import { DbOrTransaction } from "@/drizzle/util/transaction-util";
import { seedWordListInDb } from "./seed-word-list-in-db";

export async function seedAllWordListsForAllLanguages(db: DbOrTransaction) {
    console.log('🌱 Start seeding word lists');

    const wordListLengths = [5, 6, 7, 8, 9, 10, 11, 12];
    const languages = ["nl"];

    for(var i=0; i<wordListLengths.length; i++) {
        for(var j=0; j<languages.length; j++) {
            const wordLength = wordListLengths[i];
            const language = languages[j];

            const tableName = `${language}_words`
            const fileName = `public/word-lists/${language}/cleaned-${language}-${wordLength}.txt`;

            try {
                
                await seedWordListInDb(
                    fileName,
                    tableName,
                    wordListLengths[0],
                    wordListLengths[wordListLengths.length - 1],
                    db
                );
                console.log(`✅ Successfully seeded ${fileName}`);
            } catch(error) {
                console.error(`❌ Seeding of ${fileName} in table ${tableName} failed:`, error);
            }
        }
    }
}
