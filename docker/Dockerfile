FROM node:8.9.1

RUN apt-get update && \
  apt-get install curl git make perl -y

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /home/app

COPY package.json yarn.lock /home/app/

RUN yarn

COPY ./firebase-config.json /home/firebase-config.json

COPY . /home/app/

RUN mkdir -p /home/app/tmp/routes

CMD node /home/app/server.js

