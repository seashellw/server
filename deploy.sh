docker image prune -f
docker login -u docker-1664447769279 -p 40cd3a66efd32cae7b4f8ae8ac789ff3e0c934c8 seaes-docker.pkg.coding.net
docker pull seaes-docker.pkg.coding.net/seashellw/docker/server:latest
docker stop server || true
docker rm server || true
docker run -d --network my --ip 192.168.0.3 --dns 8.8.8.8 --name server seaes-docker.pkg.coding.net/seashellw/docker/server:latest 

