docker build -t server-base -f ./cmd/Dockerfile .
docker tag server-base seaes-docker.pkg.coding.net/seashellw/docker/server-base:latest
docker push seaes-docker.pkg.coding.net/seashellw/docker/server-base:latest

