# 安装依赖
yarn

# 前端构建
yarn build

# 虚拟机部署
# 直接copy，如果scp出现权限问题，需要将 ~/.ssh/id_rsa.pub内容添加到目标机的~/.ssh/authorized_keys文件中
# nginx 配置修改后，要在目标机器上执行 nginx -s reload
TARGET="172.16.xxx.xxx"
scp -r build/* app@$TARGET:/home/app/nginx/html
ssh app@$TARGET "chmod 775 -R /home/app/nginx"

scp deploy/machine/nginx.conf app@$TARGET:/home/app/nginx/conf
ssh app@$TARGET "nginx -s reload" # 重启ng，一般是ng配置改变了之后需要
