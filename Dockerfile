FROM node:18-alpine as base

RUN npm set progress=false

EXPOSE 3000
WORKDIR /usr/src/app

COPY ./package* ./
COPY ./config ./config
COPY ./db ./db
COPY ./src ./src
COPY ./types ./types
COPY ./tsconfig.json ./tsconfig.json
COPY ./api.yaml ./api.yaml

RUN npm ci

RUN npm run build

CMD node dist/src/index.js
