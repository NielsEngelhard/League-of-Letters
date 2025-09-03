# Deploying with docker compose

## Local
All files are present ...

## Prod
Create a ```lol-actions.env``` and ```lol-core.env``` in the prod folder. 

Run command:
```docker-compose -f docker-compose.prod.yml --env-file ./env/.env up```