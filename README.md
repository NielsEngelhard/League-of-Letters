# About


# Infrastructure
- NextJS server and client app
- Websocket app for realtime connections
- Postgres Database

# Local Development

# Eslint fix issues 
```npx eslint . --fix```

## Docker
- docker-compose -f docker-compose.local.yml up --build
- docker-compose -f docker-compose.prod.yml up --build

# Seeding

## Seeding Words
The file ```letter-league\src\drizzle\seed\data-seed-full.ts``` contains the logic for seeding all words for all languages initially. In this file you can set the connection string of the database.

# Backlog
There is a BACKLOG.md for features