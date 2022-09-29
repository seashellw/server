FROM node AS node
WORKDIR /root

COPY package.json ./
COPY .npmrc ./

RUN npm install -g pnpm
RUN pnpm install

COPY . ./

RUN pnpm run build

EXPOSE 80 443
CMD ["pnpm","run","start"]
