import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:1797BBE575CC4BA9960982B37AE055EB@134.209.199.44:8082/league_of_letters";

const isSmallSubset = false; // FULL WORDS
seedWordsInDatabase(dbConnectionString, isSmallSubset);