#!/bin/bash

set -e

DROPLET_IP="159.223.228.197"
DROPLET_PASSWORD="<SECRET>"
DROPLET_USER="root"
REMOTE_DIR="/root"

ssh_cmd() {
    sshpass -p "$DROPLET_PASSWORD" ssh -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
}

scp_cmd() {
    sshpass -p "$DROPLET_PASSWORD" scp -o StrictHostKeyChecking=no "$@"
}

echo "- Deploy docker-compose.yml (copy)"
scp_cmd docker-compose.yml "$DROPLET_USER@$DROPLET_IP:$REMOTE_DIR/"

echo "- Deploy env directory (copy)" 
scp_cmd -r env/ "$DROPLET_USER@$DROPLET_IP:$REMOTE_DIR/"

echo "- Install docker and docker compose if not already"
ssh_cmd "
if ! command -v docker &> /dev/null; then
    apt-get update
    apt-get install -y docker.io docker-compose
    systemctl start docker
    systemctl enable docker
fi
"

echo "- Apply Docker Compose changes"
ssh_cmd "cd $REMOTE_DIR && docker-compose down && docker-compose up -d"

echo "Done! Check status: ssh $DROPLET_USER@$DROPLET_IP 'docker-compose ps'"