#! /bin/bash

if [[ ($1 == "prod" || $1 == "dev") && ($2 == "up" || $2 == "down") ]]; then
    fileEnv="docker-compose.$1.yaml"
    upDown=$2
    if [[ $2 == "up" ]]; then
        echo "Running docker-compose -f docker-compose.yaml -f ${fileEnv} $upDown -d --build"
        docker-compose -f docker-compose.yaml -f ${fileEnv} $upDown -d --build
    else
        echo "Running docker-compose -f docker-compose.yaml -f ${fileEnv} $upDown"
        docker-compose -f docker-compose.yaml -f ${fileEnv} $upDown
    fi
else
    echo "Need to follow format ./deploy.sh prod|dev up|down"
fi