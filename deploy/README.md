# Deploying with docker compose

## Local
cd to ./local and run ```docker compose up --build``` everything for local development is already filled in

## Prod
cd to ./prod

Create a ```lol-actions.env``` and ```lol-core.env``` in the prod folder. See local folder for format. Also have a .env in the /prod directory for the docker-compose to use.

## Deploy script
The droplet-prod-deploy.bash script does some automated steps:
- Deploy docker-compose.yml (copy)
- Deploy env directory (copy)
- Deploy nginx.config
- Apply Docker Compose changes

## Scripts
- init-server.bash Run once on the server to install dependencies like docker and nginx so the deployment can run.
- deploy-bash Deploys environment variables and docker compose that are in the prod folder on the server and runs them
- docker-build-and-push.bash bash docker-build-and-push.bash <version_tag> <build_core:true|false> <build_actions:true|false>

### One time setup of server 
- run init-server.bash. This installs all needed things on the server like nginx and docker (compose).

### Connect to Droplet
- Create SSH key
- Add in DigitalOcean the public key you just generated (see article on what and how)

The droplet is authenticated via ssh key. So you need to create an ssh key pair and add it to the server the connect to it: https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/

### Create a new deployment
Steps:
- Build images using docker-build-and-push.bash
- Change versions to new ones in docker-compose.yml
- run deploy.bash to apply the version changes and run them on the server. deploy.bash updates everything based on what you have in the /deploy/prod directory of this repository.

# CheatSheet
- Terminal to droplet ```ssh root@159.223.228.197```
- bash docker-build-and-push.bash 0.2 true false
- bash deploy.bash