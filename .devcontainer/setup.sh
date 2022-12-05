npm install -g pnpm
SHELL=bash pnpm setup && source /home/vscode/.bashrc
pnpm install
pnpm db:gen
