# 安装依赖
yarn

# 前端构建
yarn build

# 将构建生成的静态文件copy到deploy目录，提升docker构建速度
rm -rf deploy/rancher/build && cp -r build/ deploy/rancher/build

# 进入deploy目录
cd deploy/rancher || exit

# 构建docker镜像
cat Dockerfile
docker build --no-cache -t bh-harbor.suixingpay.com/zhaikun/${JOB_BASE_NAME}:${BUILD_ID} -f Dockerfile .
docker push bh-harbor.suixingpay.com/zhaikun/${JOB_BASE_NAME}:${BUILD_ID}

# deploy发布
sed -i "s/NAMESPACE_NAME/front-center/g" deployment.yaml
sed -i "s/JOB_BASE_NAME/${JOB_BASE_NAME}/g" deployment.yaml
sed -i "s/BUILD_ID/${BUILD_ID}/g" deployment.yaml
cat deployment.yaml
kubectl apply -f deployment.yaml
