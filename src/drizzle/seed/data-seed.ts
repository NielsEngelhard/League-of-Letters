import { drizzle } from "drizzle-orm/node-postgres";

async function seed() {
    console.log('🌱 Seeding database...');

    const db = drizzle("postgresql://postgres:kaas@localhost:5432/memorable");

    try {
        // TODO: seed data here
      
        console.log('✅ Seed completed successfully');
    } catch (error) {
      console.error('❌ Seed failed:', error);
    }
  }
  
seed();