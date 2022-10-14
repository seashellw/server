FROM node:alpine
WORKDIR /root

COPY ./package.json ./
COPY ./.npmrc ./
COPY ./.env ./

RUN npm install -g pnpm && pnpm install

COPY . ./

RUN pnpm run build

EXPOSE 80 443
CMD ["pnpm","run","start"]
