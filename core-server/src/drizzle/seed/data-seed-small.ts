import { seedWordsInDatabase } from "./data-seed-base";

// const dbConnectionString  = "postgresql://postgres:<PASSWORD>@152.42.140.58:8082/league_of_letters"; // Droplet db
// const dbConnectionString  = "postgresql://postgres:kaas@localhost:8082/league-of-letters"; // Local docker
const dbConnectionString = "postgresql://postgres:kaas@localhost:5432/league-of-letters"; // Local pg server

const isSmallSubset = true; // Small subset for dev/tst purposes
seedWordsInDatabase(dbConnectionString, isSmallSubset);