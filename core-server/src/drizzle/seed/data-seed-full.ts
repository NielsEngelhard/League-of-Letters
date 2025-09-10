import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:Q8XOibO0dKHRa8Q8XOibO0dKHRa@152.42.140.58:8082/league_of_letters";

const isSmallSubset = false; // FULL WORDS
seedWordsInDatabase(dbConnectionString, isSmallSubset);