import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:kaas@localhost:8082/letter-league";

const isSmallSubset = false; // FULL WORDS
seedWordsInDatabase(dbConnectionString, isSmallSubset);