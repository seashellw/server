FROM node:alpine
WORKDIR /root

COPY ./package.json ./
COPY ./.npmrc ./
COPY ./.env ./

RUN npm install -g pnpm && pnpm install
