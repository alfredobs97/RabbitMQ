#!/bin/sh

/usr/src/app/wait-for-it.sh -h rabbitmq -p 5672 -t 120
if [ -f 'generateEmail.js' ];then
node generateEmail.js
fi
if [ -f 'generateKey.js' ];then
node generateKey.js
fi
if [ -f 'server.js' ];then
node server.js
fi