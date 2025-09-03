# Deploying with docker compose

## Local
cd to ./local and run ```docker compose up --build``` everything for local development is already filled in

## Prod
Create a ```lol-actions.env``` and ```lol-core.env``` in the prod folder. 

Run command:
```docker-compose -f docker-compose.prod.yml --env-file ./env/.env up```