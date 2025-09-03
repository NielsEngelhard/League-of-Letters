#!/bin/bash

# DigitalOcean Droplet Deployment Script
# This script deploys prod docker-compose.yml and env directory to your droplet
# and applies the changes by updating containers

set -e  # Exit on any error

DROPLET_IP="159.223.228.197"
DROPLET_PASSWORD="SECRET"

# Configuration - Update these variables for your setup
DROPLET_USER="root"  # or your preferred user
REMOTE_ROOT_DIR="/root"  # or wherever you want to deploy
USE_SSHPASS="yes"  # Set to "no" if you prefer interactive prompts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check dependencies
check_dependencies() {
    if [ "$USE_SSHPASS" = "yes" ]; then
        # Check if sshpass is installed
        if ! command -v sshpass &> /dev/null; then
            print_error "sshpass not found but USE_SSHPASS is set to 'yes'"
            print_status "sshpass is required to use stored passwords without prompts."
            print_status "Install commands:"
            print_status "  Ubuntu/Debian: sudo apt-get install sshpass"
            print_status "  macOS: brew install sshpass"
            print_status "  CentOS/RHEL: sudo yum install sshpass"
            print_status ""
            print_status "Falling back to interactive password prompts..."
            USE_SSHPASS="no"
        else
            print_status "sshpass found ✓"
            if [ -n "$DROPLET_PASSWORD" ]; then
                print_status "Password configured ✓ - no prompts should occur"
            else
                print_status "Password not set - will prompt once"
            fi
        fi
        
        # Get password if sshpass is available but password not set
        if [ "$USE_SSHPASS" = "yes" ] && [ -z "$DROPLET_PASSWORD" ]; then
            echo -n "Enter password for $DROPLET_USER@$DROPLET_IP (will be used for all operations): "
            read -s DROPLET_PASSWORD
            echo
        fi
    else
        print_status "Interactive password mode enabled - you will be prompted multiple times"
    fi
}

# Function to execute SSH commands
ssh_exec() {
    if [ "$USE_SSHPASS" = "yes" ] && [ -n "$DROPLET_PASSWORD" ]; then
        sshpass -p "$DROPLET_PASSWORD" ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
    else
        ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
    fi
}

# Function to execute SCP commands
scp_exec() {
    if [ "$USE_SSHPASS" = "yes" ] && [ -n "$DROPLET_PASSWORD" ]; then
        sshpass -p "$DROPLET_PASSWORD" scp -o StrictHostKeyChecking=no "$@"
    else
        scp -o StrictHostKeyChecking=no "$@"
    fi
}

check_local_files() {
    print_status "Checking local files..."
    
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found in current directory!"
        exit 1
    fi
    
    if [ ! -d "env" ]; then
        print_error "env directory not found in current directory!"
        exit 1
    fi
    
    print_status "Local files verified ✓"
}

# Test SSH connection
test_ssh_connection() {
    print_status "Testing SSH connection to droplet..."
    
    if [ "$USE_SSHPASS" = "no" ]; then
        print_status "You will be prompted for your password multiple times during deployment..."
    fi
    
    if ssh_exec "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_status "SSH connection successful ✓"
    else
        print_error "SSH connection failed. Please check your droplet IP, user, and credentials."
        exit 1
    fi
}

# Deploy docker-compose.yml
deploy_docker_compose() {
    print_step "Deploying docker-compose.yml..."
    
    scp_exec "docker-compose.yml" "$DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR/"
    
    if [ $? -eq 0 ]; then
        print_status "docker-compose.yml deployed successfully ✓"
    else
        print_error "Failed to deploy docker-compose.yml"
        exit 1
    fi
}

# Deploy env directory
deploy_env_directory() {
    print_step "Deploying env directory..."
    
    # Check if env directory has files
    if [ ! "$(ls -A env/)" ]; then
        print_warning "env directory is empty - nothing to copy"
        return 0
    fi
    
    # List files to be copied for debugging
    print_status "Files to copy from env/:"
    ls -la env/ | sed 's/^/  /'
    
    # Create env directory on remote server if it doesn't exist
    ssh_exec "mkdir -p $REMOTE_ROOT_DIR/env"
    
    # Copy all files from local env directory to remote env directory
    # Using the entire env/ directory instead of env/* to handle hidden files and empty dirs
    scp_exec -r env/ "$DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR/"
    
    if [ $? -eq 0 ]; then
        print_status "env directory deployed successfully ✓"
        
        # Verify files were copied
        print_status "Verifying copied files on server:"
        ssh_exec "ls -la $REMOTE_ROOT_DIR/env/ | head -10"
    else
        print_error "Failed to deploy env directory"
        print_status "Trying alternative copy method..."
        
        # Alternative method: copy each file individually
        for file in env/*; do
            if [ -f "$file" ]; then
                print_status "Copying $(basename "$file")..."
                scp_exec "$file" "$DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR/env/"
            fi
        done
        
        print_status "Alternative copy method completed"
    fi
}

# Install Docker and Docker Compose if needed
install_docker() {
    print_step "Installing Docker and Docker Compose..."
    
    # Update package index
    print_status "Updating package index..."
    ssh_exec "apt-get update"
    
    # Install prerequisites
    print_status "Installing prerequisites..."
    ssh_exec "apt-get install -y ca-certificates curl gnupg lsb-release"
    
    # Add Docker's official GPG key
    print_status "Adding Docker GPG key..."
    ssh_exec "mkdir -p /etc/apt/keyrings && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg"
    
    # Set up the repository
    print_status "Setting up Docker repository..."
    ssh_exec 'echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null'
    
    # Update package index again
    ssh_exec "apt-get update"
    
    # Install Docker Engine
    print_status "Installing Docker Engine..."
    ssh_exec "apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin"
    
    # Start and enable Docker
    print_status "Starting Docker service..."
    ssh_exec "systemctl start docker && systemctl enable docker"
    
    # Install Docker Compose (standalone)
    print_status "Installing Docker Compose..."
    ssh_exec "curl -L \"https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)\" -o /usr/local/bin/docker-compose"
    ssh_exec "chmod +x /usr/local/bin/docker-compose"
    
    # Verify installation
    print_status "Verifying Docker installation..."
    if ssh_exec "docker --version && docker-compose --version"; then
        print_status "Docker and Docker Compose installed successfully ✓"
    else
        print_error "Docker installation verification failed"
        exit 1
    fi
}

# Apply Docker Compose changes
apply_docker_changes() {
    print_step "Applying Docker Compose changes..."
    
    # Check if Docker and Docker Compose are available
    print_status "Checking Docker installation on droplet..."
    if ! ssh_exec "which docker && which docker-compose" > /dev/null 2>&1; then
        print_warning "Docker or Docker Compose not found on droplet!"
        print_status "Installing Docker and Docker Compose automatically..."
        install_docker
    fi
    
    print_status "Docker installation verified ✓"
    
    # Navigate to the deployment directory
    print_status "Changing to deployment directory: $REMOTE_ROOT_DIR"
    
    # Pull latest images (this will only pull if there are updates)
    print_status "Pulling latest Docker images..."
    ssh_exec "cd $REMOTE_ROOT_DIR && docker-compose pull"
    
    if [ $? -ne 0 ]; then
        print_warning "Image pull completed with warnings (this is usually normal)"
    else
        print_status "Images pulled successfully ✓"
    fi
    
    # Stop and recreate containers with updated images
    print_status "Recreating containers with updated configurations..."
    ssh_exec "cd $REMOTE_ROOT_DIR && docker-compose up -d --force-recreate"
    
    if [ $? -eq 0 ]; then
        print_status "Containers recreated successfully ✓"
    else
        print_error "Failed to recreate containers"
        print_status "Checking container status..."
        ssh_exec "cd $REMOTE_ROOT_DIR && docker-compose ps"
        exit 1
    fi
    
    # Show final status
    print_status "Final container status:"
    ssh_exec "cd $REMOTE_ROOT_DIR && docker-compose ps"
    
    # Clean up unused images to save space
    print_status "Cleaning up unused Docker images..."
    ssh_exec "docker image prune -f" || print_warning "Image cleanup completed with warnings"
}

# Show deployment summary
show_deployment_summary() {
    print_step "Deployment Summary"
    echo ""
    print_status "✅ Files deployed to: $DROPLET_IP:$REMOTE_ROOT_DIR"
    print_status "✅ Docker containers updated and running"
    echo ""
    print_status "To check logs, run:"
    echo "  ssh $DROPLET_USER@$DROPLET_IP 'cd $REMOTE_ROOT_DIR && docker-compose logs -f'"
    echo ""
    print_status "To check status, run:"
    echo "  ssh $DROPLET_USER@$DROPLET_IP 'cd $REMOTE_ROOT_DIR && docker-compose ps'"
    echo ""
}

# Main deployment function
main() {
    print_status "Starting deployment to DigitalOcean droplet..."
    print_status "Target: $DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR"
    print_status "Authentication: password"
    echo ""
    
    check_dependencies
    check_local_files
    test_ssh_connection
    deploy_docker_compose
    deploy_env_directory
    apply_docker_changes
    
    echo ""
    print_status "🚀 Deployment completed successfully!"
    show_deployment_summary
}

# Run main function
main