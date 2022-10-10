FROM node:alpine
WORKDIR /root

COPY ./package.json ./
COPY ./.npmrc ./

RUN npm install -g pnpm && pnpm install
