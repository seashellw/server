FROM node:alpine AS node
WORKDIR /root

RUN apk add git

COPY package.json ./
COPY .npmrc ./

RUN npm install -g pnpm && pnpm install

COPY . ./

RUN pnpm run build

EXPOSE 80 443
CMD ["pnpm","run","start"]
