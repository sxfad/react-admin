# 快速开始
从[github](https://github.com/sxfad/react-admin)上clone代码，通过下面介绍的命令，进行开发或者生产构建。

## 环境
- [yarn](https://yarnpkg.com) v1.13.0
- [node](https://nodejs.org) v10.13.0

## 下载
```bash
$ git clone https://github.com/sxfad/react-admin.git
```

## 安装依赖
```bash
$ cd react-admin
$ yarn
// 使用国内淘宝镜像镜像
$ yarn --registry https://registry.npm.taobao.org
```
注：首次使用yarn安装依赖可能比较慢，可以切换到国内镜像，或者翻墙。

## 开发启动
```bash
$ cd react-admin
$ yarn start

# 指定端口
$ PORT=8080 yarn start

# HTTPS方式启动
$ HTTPS=true yarn start

# 不清除终端log，如果要调试构建脚本时，比较实用
$ FORCE_COLOR=true yarn start | cat
```
注：启动会有点慢，耐心等待一会儿，启动成功后会自动打开浏览器。
windows环境下可以使用 [cross-env](https://www.npmjs.com/package/cross-env)设置命令行变量。

## 生产构建
```bash
$ cd react-admin

$ yarn build

# 构建输入到指定目录
$ BUILD_PATH=../dist yarn build
```
注：构建生成的文件在 `/react-admin/build` 目录下；[nginx配置参考](NGINX.md)。

## 域名子目录发布项目
如果项目需要挂载到域名的一个子目录下，比如 `http://xxx.com/react-admin`。添加命令行参数 BASE_NAME=/react-admin

注：如果前端构建完成的静态页面，放在nginx静态目录的react-admin目录下，添加命令行参数 PUBLIC_URL=/react-admin;

### 开发
启动：
```bash
$ BASE_NAME=/react-admin yarn start
```
访问：
```
http://localhost:4001/react-admin/
```

### 生产

构建：
```bash
$ BASE_NAME=/react-admin yarn build
```

访问：
```
http://xxx.com/react-admin
```

注：windows环境下，使用git bash 要对/进行转义： `BASE_NAME=//react-admin yarn build`


