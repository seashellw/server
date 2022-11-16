npm install -g pnpm
SHELL=bash pnpm setup
source /root/.bashrc
pnpm install
pnpm db:gen
