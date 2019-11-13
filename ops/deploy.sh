#!/bin/bash
CONTAINER_NAME=$1
IMAGE_NAME=$2

sudo docker kill $CONTAINER_NAME
sudo docker load -i ~/temp.tar
sudo docker run --rm -d -p 45980:5000 --name $CONTAINER_NAME $IMAGE_NAME