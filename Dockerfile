FROM node:alpine
WORKDIR /root

RUN npm install -g pnpm

COPY ./package.json ./
COPY ./.npmrc ./
COPY ./.env ./
RUN pnpm install

COPY ./prisma ./
RUN pnpm run db:gen

COPY . ./

RUN pnpm run build

EXPOSE 80 443
CMD ["pnpm","run","start"]
