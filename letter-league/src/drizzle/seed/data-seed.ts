import { seedAllWordListsForAllLanguages } from "@/features/word/util/script/seed-words-in-db";
import { drizzle } from "drizzle-orm/node-postgres";
import { DbOrTransaction } from "../util/transaction-util";
import { NlWordsTable } from "../schema";

const DB_CONNETION_STRING = "postgresql://postgres:kaaskaas@localhost:5432/letter-league";

async function seed() {
    console.log('🌱 Seeding database...');
    
    const db = drizzle("postgresql://postgres:kaas@localhost:5432/letter-league") as DbOrTransaction;

    try {
      db.insert(NlWordsTable).values({ length: 3, word: "kip"});
        await seedAllWordListsForAllLanguages(db);

        console.log('✅ Seed completed successfully');
        return;
    } catch (error) {
      console.error('❌ Seed failed:', error);
      return;
    }
  }
  
seed();