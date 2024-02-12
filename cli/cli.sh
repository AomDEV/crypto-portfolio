#!/bin/sh

# get arguments
command=$1

# check if command contains only `build` or `up`
if [ "$command" = "build" ]; then
    echo "Building docker images"
elif [ "$command" = "up" ]; then
    echo "Starting docker containers"
elif [ "$command" = "down" ]; then
    echo "Stopping docker containers"
else
    echo "Usage: cli.sh [build|up|down]"
    exit 1
fi

# Caddy and Databases
if [[ "$command" == up || "$command" == down ]]; then
    if [ "$command" = "up" ]; then
        # Create network if not exists
        NETWORK_NAME="caddy"
        if [[ "$(docker network ls | grep "${NETWORK_NAME}")" != "" ]] ; then
            docker network rm "${NETWORK_NAME}"
        fi
        echo "Network ID: $(docker network create caddy)"

        # Start docker containers
        docker compose -f "./caddy/docker-compose.yml" up -d && \
        docker compose -f "./db/docker-compose.yml" up -d
    elif [ "$command" = "down" ]; then
        # Stop docker containers
        docker compose -f "./caddy/docker-compose.yml" down && \
        docker compose -f "./db/docker-compose.yml" down
    fi
fi

# For loop through app, api and copy Dockerfile to root
for folder in app api; do
    cp "./$folder/Dockerfile" "../$folder/Dockerfile"
    cp "./$folder/docker-compose.yml" "../$folder/docker-compose.dist.yml"
    
    if [ "$command" = "build" ]; then
        docker compose -f "../$folder/docker-compose.dist.yml" build
    elif [ "$command" = "up" ]; then
        docker compose -f "../$folder/docker-compose.dist.yml" up -d
    fi
done