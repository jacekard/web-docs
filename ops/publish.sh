#!/bin/bash
docker save -o ./temp.tar $IMAGE_NAME
scp -i ../$KEY_FILE -P $SERVER_PORT ./temp.tar $CI_USER@$SERVER_IP:~/temp.tar