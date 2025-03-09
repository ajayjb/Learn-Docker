FROM node:20-alpine

RUN apk --no-cache add curl

WORKDIR /usr/app

COPY ./package.json ./

RUN NODE_OPTIONS="--max-old-space-size=8192" && npm install

COPY ./ ./

CMD [ "npm", "run", "start" ]