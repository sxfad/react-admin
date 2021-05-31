# 安装依赖
yarn

# 前端构建
yarn build

# 虚拟机部署，直接copy
#scp -r build/* app@172.16.175.134:/home/app/nginx/html

# 将构建生成的静态文件copy到deploy目录，提升docker构建速度
rm -rf deploy/build && cp -r build/ deploy/build

# 进入deploy目录
cd deploy

# 构建docker镜像
cat Dockerfile
docker build --no-cache -t bh-harbor.suixingpay.com/zhaikun/${JOB_BASE_NAME}:${BUILD_ID} -f Dockerfile .
docker push bh-harbor.suixingpay.com/zhaikun/${JOB_BASE_NAME}:${BUILD_ID}

# deploy发布
# TODO 注意修改 NAMESPACE_NAME
sed -i "s/NAMESPACE_NAME/front-center/g" deployment.yaml
sed -i "s/JOB_BASE_NAME/${JOB_BASE_NAME}/g" deployment.yaml
sed -i "s/BUILD_ID/${BUILD_ID}/g" deployment.yaml
cat deployment.yaml
kubectl apply -f deployment.yaml
