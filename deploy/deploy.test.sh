# 本地发布测试环境脚本

# 构建前端
yarn build

echo "开始上传..."
# 删除原文件
sshpass -p 123456 ssh app@xxx.xxx.xxx.xxx "rm -rf /home/app/nginx/html/*"
# 上传新文件
sshpass -p 123456 scp -r ./build/* app@xxx.xxx.xxx.xxx:/home/app/nginx/html
echo "上传成功！"

# 拷贝ng配置
# sshpass -p 123456 scp ./deploy/nginx.test.conf app@xxx.xxx.xxx.xxx:/home/app/nginx/conf
# 重启ng，使配置生效
# sshpass -p 123456 ssh app@xxx.xxx.xxx.xxx "nginx -s reload"
