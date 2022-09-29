docker image prune -f
docker pull seaes-docker.pkg.coding.net/seashellw/docker/server:latest
docker stop server || true
docker rm server || true
docker run -d --network my --ip 192.168.0.3 --dns 8.8.8.8 --name server seaes-docker.pkg.coding.net/seashellw/docker/server:latest 

