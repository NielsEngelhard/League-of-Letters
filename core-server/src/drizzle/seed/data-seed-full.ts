import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:Q8XOibO0dKHRa8Q8XOibO0dKHRa@64.227.93.150:8082/league_of_letters";

const isSmallSubset = false; // FULL WORDS
seedWordsInDatabase(dbConnectionString, isSmallSubset);