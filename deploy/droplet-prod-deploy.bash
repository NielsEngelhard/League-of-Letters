#!/bin/bash

# DigitalOcean Droplet Deployment Script
# This script deploys docker-compose.prod.yml and env directory to your droplet

set -e  # Exit on any error

DROPLET_IP="<IP>"
DROPLET_PASSWORD="<PASSWORD>"  # Set your password here, or leave empty to be prompted once

# Configuration - Update these variables for your setup
DROPLET_USER="root"  # or your preferred user
REMOTE_ROOT_DIR="/root"  # or wherever you want to deploy

# Authentication method - choose one:
# Set to "key" for SSH key authentication or "password" for password authentication
AUTH_METHOD="password"  # or "key"

# SSH Key configuration (only needed if AUTH_METHOD="key")
SSH_KEY_PATH="~/.ssh/id_rsa"  # path to your SSH private key

USE_SSHPASS="yes"  # Set to "no" if you prefer interactive prompts (will ask password multiple times)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check dependencies
check_dependencies() {
    if [ "$AUTH_METHOD" = "password" ]; then
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
    elif [ "$AUTH_METHOD" = "key" ]; then
        if [ ! -f "$SSH_KEY_PATH" ]; then
            print_error "SSH key not found at: $SSH_KEY_PATH"
            exit 1
        fi
    else
        print_error "Invalid AUTH_METHOD. Use 'key' or 'password'"
        exit 1
    fi
}

# Function to execute SSH commands based on auth method
ssh_exec() {
    if [ "$AUTH_METHOD" = "password" ]; then
        if [ "$USE_SSHPASS" = "yes" ] && [ -n "$DROPLET_PASSWORD" ]; then
            sshpass -p "$DROPLET_PASSWORD" ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
        else
            ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$DROPLET_USER@$DROPLET_IP" "$1"
        fi
    else
        ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 -o BatchMode=yes "$DROPLET_USER@$DROPLET_IP" "$1"
    fi
}

# Function to execute SCP commands based on auth method
scp_exec() {
    if [ "$AUTH_METHOD" = "password" ]; then
        if [ "$USE_SSHPASS" = "yes" ] && [ -n "$DROPLET_PASSWORD" ]; then
            sshpass -p "$DROPLET_PASSWORD" scp -o StrictHostKeyChecking=no "$@"
        else
            scp -o StrictHostKeyChecking=no "$@"
        fi
    else
        scp -i "$SSH_KEY_PATH" "$@"
    fi
}
check_local_files() {
    print_status "Checking local files..."
    
    if [ ! -f "docker-compose.prod.yml" ]; then
        print_error "docker-compose.prod.yml not found in current directory!"
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
    
    if [ "$AUTH_METHOD" = "password" ] && [ "$USE_SSHPASS" = "no" ]; then
        print_status "You will be prompted for your password multiple times during deployment..."
    fi
    
    if ssh_exec "echo 'SSH connection successful'" > /dev/null 2>&1; then
        print_status "SSH connection successful ✓"
    else
        print_error "SSH connection failed. Please check your droplet IP, user, and credentials."
        exit 1
    fi
}

# Deploy docker-compose.prod.yml
deploy_docker_compose() {
    print_status "Deploying docker-compose.prod.yml..."
    
    scp_exec "docker-compose.prod.yml" "$DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR/"
    
    if [ $? -eq 0 ]; then
        print_status "docker-compose.prod.yml deployed successfully ✓"
    else
        print_error "Failed to deploy docker-compose.prod.yml"
        exit 1
    fi
}

# Deploy env directory
deploy_env_directory() {
    print_status "Deploying env directory..."
    
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

# Main deployment function
main() {
    print_status "Starting deployment to DigitalOcean droplet..."
    print_status "Target: $DROPLET_USER@$DROPLET_IP:$REMOTE_ROOT_DIR"
    print_status "Authentication: $AUTH_METHOD"
    
    check_dependencies
    check_local_files
    test_ssh_connection
    deploy_docker_compose
    deploy_env_directory
    
    print_status "Deployment completed successfully! 🚀"
    print_status "Files deployed to: $DROPLET_IP:$REMOTE_ROOT_DIR"
}

# Run main function
main