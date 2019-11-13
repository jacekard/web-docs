#!/bin/bash

openssl aes-256-cbc -K $encrypted_4ff76aa56d60_key -iv $encrypted_4ff76aa56d60_iv -in ../out.pfx.enc -out ../WebDocs/out.pfx -d
openssl aes-256-cbc -K ${encrypted_5b1b7de2a19f_key} -iv ${encrypted_5b1b7de2a19f_iv} -in ../deploy_key.enc -out ../deploy_key -d
eval "$(ssh-agent -s)"
chmod 600 ../$KEY_FILE
echo -e "Host $SERVER_IP\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
ssh-add ../$KEY_FILE