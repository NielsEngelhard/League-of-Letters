![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white)
![DigitalOcean](https://img.shields.io/badge/DigitalOcean-0080FF?logo=digitalocean&logoColor=white)
![Certbot](https://img.shields.io/badge/Certbot-3EAAAF?logo=letsencrypt&logoColor=white)
![Bash](https://img.shields.io/badge/Shell_Scripts-121011?logo=gnu-bash&logoColor=white)

# 🚀 Deployment Guide — League of Letters

This folder contains all scripts and configuration needed to deploy **League of Letters** using **Docker Compose**.  
It supports both **local development** and **production deployment** (PROD scrips to deploy on a DigitalOcean Droplet).  

---

## 📦 Prerequisites

- Docker & Docker Compose installed.
- SSH access to the target server (using an SSH key).
- (For production) A domain name configured to point to the server.
- Nginx + Certbot for HTTPS certificates.
---

## 🖥️ Local Deployment

For local development with Docker Compose:

```bash
cd ./local
docker compose up --build
```
Everything required for local development is preconfigured.

---

## 🌐 Production Deployment
Production configs are located in ```./prod```.
Create environment files:
- lol-actions.env
- lol-core.env

.env (used by docker-compose.yml)

👉 Use the ```./local``` folder as a reference for formatting.

Start services:
```bash
cd ./prod
docker compose up -d
```

## Connecting with Digital Ocean Droplet
There are several deployment script in ```/deploy/prod/script``` available. These should be executed using ssh, so you need to setup ssh with the server first by creating a new SSH key.

### Generating SSH Key
Generate a new SSH key:
``` ssh-keygen -t ed25519 -C "your_email@example.com"```

Add the public key to your DigitalOcean Droplet.
👉 Guide: Adding SSH Keys to Droplets (https://docs.digitalocean.com/products/droplets/how-to/add-ssh-keys/)

Connect to the server:
```ssh root@<your-server-ip>```

## 🚀 Creating a New Deployment
Steps:
- 1: Build Docker images: ```bash docker-build-and-push.bash <version_tag> <build_core:true|false> <build_actions:true|false>```
- 2: Update versions in docker-compose.yml.
- 3: Apply changes on server by running ```bash deploy.bash```. This updates all services using the configs in /deploy/prod.
- 4: Because nginx expects a certificate (which certbot will generate) we must do some small manual steps first:

Start nginx first:
```docker-compose up -d nginx```

Run certbot manually to obtain certificates:
```docker-compose run --rm certbot```

## Deployment Scripts

### Deploy
```deploy.bash```

Automates deployment by:
- Copying docker-compose.yml
- Copying environment files
- Deploying nginx.config
- Applying Docker Compose changes

### Initialize server
```init-server.bash```
Run once on a fresh server to install dependencies (Docker, Docker Compose, Nginx).

### Initialize https
After running the init script and deploying the code, it does work with http, but not with https yet. Certbot needs to be configured. First start docker-compose with the nginx config
```nginx-initial.conf```. Then run:
```
# Start everything (certbot won't run automatically due to profile)
docker-compose up -d

# Verify nginx is running
docker-compose ps

# Get certificates
docker-compose run --rm certbot

# Verify certificates were created
ls -la ./certbot/conf/live/league-of-letters.online/
```

and

```
# Download SSL config files
curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf -o ./certbot/conf/options-ssl-nginx.conf

curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem -o ./certbot/conf/ssl-dhparams.pem
```

After that you can use the nginx.conf and https should work!

### Docker build new image
```docker-build-and-push.bash```

Example:
``` bash
bash docker-build-and-push.bash 0.15 true false
```

## One-Time Server Setup
Run ```init-server.bash``` to install dependencies like docker (compose).



### Cheatsheet: 
#### Connect to Droplet
ssh root@159.223.228.197

#### Build & push core only, version 0.2
bash docker-build-and-push.bash 0.2 true false

#### Deploy updated services
bash deploy.bash