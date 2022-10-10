FROM seaes-docker.pkg.coding.net/seashellw/docker/server-base:latest
WORKDIR /root

COPY . ./

RUN pnpm run build

EXPOSE 80 443
CMD ["pnpm","run","start"]
