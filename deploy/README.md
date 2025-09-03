# Deploying with docker compose

## Local
cd to ./local and run ```docker compose up --build``` everything for local development is already filled in

## Prod
cd to ./prod

Create a ```lol-actions.env``` and ```lol-core.env``` in the prod folder. See local folder for format

Run command:
```docker-compose --env-file ./env/.env up```

## Login to digital ocean droplet
```ssh root@159.223.228.197```