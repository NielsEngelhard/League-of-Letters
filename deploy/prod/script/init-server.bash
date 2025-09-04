#!/bin/bash

set -e

DROPLET_IP="152.42.140.58"
DROPLET_USER="root"
REMOTE_DIR="/root"

ssh_cmd() {
    ssh -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
}

scp_cmd() {
    scp -o StrictHostKeyChecking=no "$@"
}

echo "- Initializing server for the first time..."

echo "- Install Docker"
ssh_cmd "
if ! command -v docker &> /dev/null; then
    apt-get install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
    add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu \$(lsb_release -cs) stable\"
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    systemctl start docker
    systemctl enable docker
    echo 'Docker installed successfully'
else
    echo 'Docker already installed'
fi
"

echo "- Install Docker Compose"
ssh_cmd "
if ! command -v docker-compose &> /dev/null; then
    curl -L \"https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo 'Docker Compose installed successfully'
else
    echo 'Docker Compose already installed'
fi
"

echo "- Install nginx"
ssh_cmd "
if ! command -v nginx &> /dev/null; then
    apt-get update
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo 'Nginx installed successfully'
else
    echo 'Nginx already installed'
fi
"

echo "- Install other useful tools"
ssh_cmd "apt-get install -y curl wget htop nano git"

echo "- Create necessary directories"
ssh_cmd "mkdir -p $REMOTE_DIR/env"

echo "✅ Server initialization complete!"
echo "You can now run the deploy script to deploy your application."