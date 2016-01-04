#!/bin/bash

echo '[+] Initializing Node Application'
npm init

echo '[+] Installing dependencies'
npm install express
npm install node-rest-client
npm install body-parser

echo '[+] Installation completed. To start:'
echo '[+]  $ node ./index.js'
