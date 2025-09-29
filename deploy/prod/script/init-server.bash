#!/bin/bash

set -e

DROPLET_IP="64.227.93.150"
DROPLET_USER="root"
REMOTE_DIR="/root"

ssh_cmd() {
    ssh -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
}

scp_cmd() {
    scp -o StrictHostKeyChecking=no "$@"
}

echo "- Initializing server for the first time..."

echo "- Updating package lists"
ssh_cmd "apt-get update"

echo "- Install Docker using official convenience script"
ssh_cmd "
set -e
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl start docker
    systemctl enable docker
    echo 'Docker installed successfully'
else
    echo 'Docker already installed'
fi
"

echo "- Install Docker Compose"
ssh_cmd "
set -e
if ! command -v docker-compose &> /dev/null; then
    curl -L \"https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    docker-compose --version
    echo 'Docker Compose installed successfully'
else
    echo 'Docker Compose already installed'
fi
"

echo "- Install other useful tools"
ssh_cmd "apt-get install -y curl wget htop nano git"

echo "- Create necessary directories"
ssh_cmd "mkdir -p $REMOTE_DIR/env"

echo "- Verify installations"
ssh_cmd "docker --version && docker-compose --version"

echo "✅ Server initialization complete!"
echo "You can now run the docker compose to deploy the actual application(s)."