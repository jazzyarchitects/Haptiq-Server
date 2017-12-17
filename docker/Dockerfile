FROM node:8.9.1

RUN apt-get update && \
  apt-get install curl git make perl -y

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

WORKDIR /home/app

COPY package.json yarn.lock /home/app/

RUN yarn

RUN npm install pm2@latest -g

COPY . /home/app/

RUN mkdir -p /home/app/tmp/routes

CMD pm2 start /home/app/server.js -i 0

