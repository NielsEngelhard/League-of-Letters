import { seedAllWordListsForAllLanguages } from "@/features/word/util/script/seed-words-in-db";
import { drizzle } from "drizzle-orm/node-postgres";
import { DbOrTransaction } from "../util/transaction-util";

const DB_CONNETION_STRING = "";

async function seed() {
    console.log('🌱 Seeding database...');
    
    const db = drizzle(DB_CONNETION_STRING) as DbOrTransaction;

    try {
        seedAllWordListsForAllLanguages(db);
      
        console.log('✅ Seed completed successfully');
    } catch (error) {
      console.error('❌ Seed failed:', error);
    }
  }
  
seed();