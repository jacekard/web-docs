#!/bin/bash
cd ../WebDocs
docker build -t $IMAGE_NAME .
cd ../ops