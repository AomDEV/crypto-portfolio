#!/bin/sh

# get arguments
command=$1

# check if command contains only `build` or `up`
if [ "$command" = "build" ]; then
    echo "Building docker images"
elif [ "$command" = "up" ]; then
    echo "Starting docker containers"
else
    echo "Usage: cli.sh [build|up]"
    exit 1
fi

# For loop through app, api and copy Dockerfile to root
for folder in app api; do
    cp "./$folder/Dockerfile" "../$folder/Dockerfile"
    cp "./$folder/docker-compose.yml" "../$folder/docker-compose.dist.yml"
    
    docker compose -f "../$folder/docker-compose.dist.yml" build
done