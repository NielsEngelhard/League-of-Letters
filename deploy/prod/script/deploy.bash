#!/bin/bash
set -e

DROPLET_IP="152.42.143.118"
DROPLET_USER="root"
REMOTE_DIR="/root"

# SSH multiplexing options - because of this the SSH password will only be prompted once.
SSH_OPTS="-o StrictHostKeyChecking=no -o ControlMaster=auto -o ControlPath=~/.ssh/control-%h-%p-%r -o ControlPersist=10m"

ssh_cmd() {
    ssh $SSH_OPTS "$DROPLET_USER@$DROPLET_IP" "$1"
}

scp_cmd() {
    scp $SSH_OPTS "$@"
}

echo "🚀 Deploying application..."

echo "- Checking if files exist locally..."
if [ ! -f "../docker-compose.yml" ]; then
    echo "ERROR: docker-compose.yml not found in current directory"
    exit 1
fi

if [ ! -f "../.env" ]; then
    echo "ERROR: .env not found in current directory"
    exit 1
fi

if [ ! -f "../env/nginx.conf" ]; then
    echo "ERROR: ./env/nginx.conf not found"
    exit 1
fi
echo "✅ All files exist locally"

echo "- Testing SSH connection..."
ssh_cmd "echo 'SSH connection successful'"

# Create the required directories on the remote server
echo "- Creating remote directories for Certbot and Nginx..."
ssh_cmd "mkdir -p $REMOTE_DIR/certbot/conf"
ssh_cmd "mkdir -p $REMOTE_DIR/certbot/www"
echo "✅ Directories created"

echo "- Deploying docker-compose.yml (copy)"
scp_cmd -v ../docker-compose.yml "$DROPLET_USER@$DROPLET_IP:$REMOTE_DIR/"

echo "- Deploying .env file (copy)"
scp_cmd ../.env "$DROPLET_USER@$DROPLET_IP:$REMOTE_DIR/"

echo "- Deploying env directory (copy)"
scp_cmd -r ../env/ "$DROPLET_USER@$DROPLET_IP:$REMOTE_DIR/"

echo "- Apply Docker Compose changes"
ssh_cmd "cd $REMOTE_DIR && docker-compose down && docker-compose up -d"

echo "✅ Deployment complete!"
echo "Check status: ssh $DROPLET_USER@$DROPLET_IP 'docker-compose ps'"
echo "View logs: ssh $DROPLET_USER@$DROPLET_IP 'docker-compose logs -f'"