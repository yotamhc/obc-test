#!/bin/bash

echo '[+] Installing NodeJS'
sudo apt-get install -y build-essential
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

echo '[+] Initializing Node Application'
npm init

echo '[+] Installing dependencies'
npm install express
npm install node-rest-client
npm install body-parser

echo '[+] Installation completed. To start:'
echo '[+]  $ node ./index.js'
