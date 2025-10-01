import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:750B5AE609654A18A7B99E9503AC22FD@134.209.199.44:8082/league_of_letters";

const isSmallSubset = false; // FULL WORDS
seedWordsInDatabase(dbConnectionString, isSmallSubset);