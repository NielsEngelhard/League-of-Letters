import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:kaas@localhost:8082/letter-league";

const isSmallSubset = true; // Small subset for dev/tst purposes
seedWordsInDatabase(dbConnectionString, isSmallSubset);