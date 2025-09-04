#!/bin/bash

# Configuration
DOCKER_HUB_USERNAME="nielsts"
LETTER_LEAGUE_IMAGE="lol-core"
ACTIONS_SERVER_IMAGE="lol-actions"
VERSION_TAG="latest"
BUILD_CORE=false
BUILD_ACTIONS=false

# Usage function
usage() {
  echo "Usage: $0 <version_tag> <build_core:true|false> <build_actions:true|false>"
  echo "Example: $0 v1.2.3 true false"
  exit 1
}

# Parse args
if [ $# -lt 3 ]; then
  usage
fi

VERSION_TAG="$1"
BUILD_CORE="$2"
BUILD_ACTIONS="$3"

echo "🚀 Building and pushing Docker images..."
echo "Username: $DOCKER_HUB_USERNAME"
echo "Version tag: $VERSION_TAG"
echo "Build core: $BUILD_CORE"
echo "Build actions: $BUILD_ACTIONS"
echo ""

if [ "$BUILD_CORE" = "true" ]; then
  echo "📦 Building lol-core..."
  docker build -t $DOCKER_HUB_USERNAME/$LETTER_LEAGUE_IMAGE:$VERSION_TAG ../../../core-server

  echo "⬆️  Pushing lol-core..."
  docker push $DOCKER_HUB_USERNAME/$LETTER_LEAGUE_IMAGE:$VERSION_TAG
fi

if [ "$BUILD_ACTIONS" = "true" ]; then
  echo "📦 Building actions-server..."
  docker build -t $DOCKER_HUB_USERNAME/$ACTIONS_SERVER_IMAGE:$VERSION_TAG ../../../actions-server

  echo "⬆️  Pushing actions-server..."
  docker push $DOCKER_HUB_USERNAME/$ACTIONS_SERVER_IMAGE:$VERSION_TAG
fi

echo ""
echo "✅ Selected images pushed successfully!"
if [ "$BUILD_CORE" = "true" ]; then
  echo "lol-core: $DOCKER_HUB_USERNAME/$LETTER_LEAGUE_IMAGE:$VERSION_TAG"
fi
if [ "$BUILD_ACTIONS" = "true" ]; then
  echo "actions-server: $DOCKER_HUB_USERNAME/$ACTIONS_SERVER_IMAGE:$VERSION_TAG"
fi
echo ""
