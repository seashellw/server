apt update && apt upgrade -y && apt install zsh -y
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
chsh -s /bin/zsh

npm install -g pnpm
SHELL=bash pnpm setup
source /root/.bashrc
pnpm install
pnpm db:gen
