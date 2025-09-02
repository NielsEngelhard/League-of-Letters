# About


# Infrastructure
- NextJS server and client app
- Websocket app for realtime connections
- Postgres Database

# Local Development
For local development you need to have postgres installed and you have to (per app) fill in the .env.example (as a .env file).

## Core app
```npm install``` and then ```npm run dev```. This allows you to do core functionality like visiting pages, creating accounts (if db connection is setup). With the core app you can also (if you have seeded the word list(s)) play solo games.

## Actions server
The actions server is used for websocket connections and cronjobs. It runs e.g. a cronjob every 24h to remove all expired games and guest accounts. It uses the websocket connection for the online/multiplayer game mode (realtime actions with websocket).

# Database
Drizzle ORM is used to migrate and generate the database. See letter-league/src/drizzle for the schemes and sql files to generate the database. Locally you can run ```npm run db:migrate``` to apply the migration.

# Eslint fix issues 
```npx eslint . --fix```

# Deploying
Both the actions server and the core server will be deployed as a Docker container. 

## Database
For now the database is also hosted inside a docker container (with a mounted volume of course), to save costs. In the future the database might receive dedicated hosting (e.g. on a cloud provider).

## Local
Navigate to /deploy/local and run:
```docker-compose -f docker-compose.local.yml up --build```

## Prod
The docker compose that is used for PROD can be found in /deploy/prod

### Build and push to registry
For building and pushing images for the actions or core server to the registry, a bash command is made (build-and-push.bash)
Navigate to /deploy/prod and run ```bash build-and-push.bash``` inside a Linux terminal to automatically build the docker image and push it to the registry. Before doing this you have to ```docker login``` in the terminal.

Usage:
```bash docker-build-and-push.bash <version_tag> <build_core:true|false> <build_actions:true|false>```

### Docker compose
```docker-compose -f docker-compose.prod.yml --env-file ./env/.env up```

### Automatic deployment of current prod directory to prod server
Before running the script you need to have installed ```sudo apt-get install sshpass```
Then fill in the IP address and the password (in the bash script) and run it in the directory ```bash droplet-prod-deploy.bash```

### DigitalOcean
There is a dedicated DigitalOcean server (droplet) that uses this docker-compose to host the containers. OK for now because cheap, it works and scaling is not a problem yet. 

# Seeding

## Seeding Words
The file ```letter-league\src\drizzle\seed\data-seed-full.ts``` contains the logic for seeding all words for all languages initially. In this file you can set the connection string of the database.

# Backlog
There is a BACKLOG.md for features