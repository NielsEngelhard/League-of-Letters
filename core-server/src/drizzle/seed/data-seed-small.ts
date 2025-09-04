import { seedWordsInDatabase } from "./data-seed-base";

const dbConnectionString  = "postgresql://postgres:kaas@localhost:5432/league-of-letters";
// const dbConnectionString  = "postgresql://postgres:kaas@localhost:8082/league-of-letters"; # docker

const isSmallSubset = true; // Small subset for dev/tst purposes
seedWordsInDatabase(dbConnectionString, isSmallSubset);