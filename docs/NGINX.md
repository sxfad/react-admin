# nginx配置参考
这里只是参考文件，根据自己的项目需求自行配置

## 一个域名对应单个项目
### 目录结构
```
.
├── /usr/local/nginx/html                 
│   ├── static
│   ├── index.html
│   └── favicon.ico
```

### nginx 配置
```nginx
# 后端服务地址
upstream api_service {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}

server {
    listen      80;
    server_name www.shubin.wang shubin.wang; # 域名地址
    root        /usr/local/nginx/html; # 前端静态文件目录
    location / {
      index index.html;
      try_files $uri $uri/ /index.html; #react-router 防止页面刷新出现404
    }

    # 静态文件缓存，启用Cache-Control: max-age、Expires
    location ~ ^/static/(css|js|media)/ {
      expires 10y;
      access_log off;
      add_header Cache-Control "public";
    }

     # 代理ajax请求 前端ajax请求以 /api 开头
    location ^~/api {
       rewrite ^/api/(.*)$ /$1 break; # 如果后端接口不是统一以api开头，去掉api前缀
       proxy_pass http://api_service/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }
}
```

## 一个域名对应多个项目
多个项目挂载到同一个域名下，可以通过子目录方式区分

比如，如下地址各对应一个项目

- http://shubin.wang
- http://shubin.wang/project1
- http://shubin.wang/project2

前端项目构建时，添加BASE_NAME PUBLIC_URL参数
```bash
BASE_NAME=/project1 PUBLIC_URL=/project1 yarn build
```
### nginx 静态文件目录结构
```
.
├── /home/ubuntu/react-admin                 
│   ├── build   // 主项目 静态文件目录
│   │   ├── static
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── project1   // 子项目静态目录 名称与 location /project1 location ~ ^/project1/static/.*  配置对应
│   │   ├── static
│   │   ├── index.html
│   │   └── favicon.ico
```

### nginx 配置
```nginx
upstream api_service {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}

upstream api_service_project1 {
  server xxx.xxx.xxx.xxx:xxxx;
  keepalive 2000;
}
server {
    listen 80;
    server_name www.shubin.wang shubin.wang; # 域名地址
    # Allow file uploads
    client_max_body_size 100M;

    # 主项目配置，访问地址 http://www.shubin.wang
    location / {
        root /home/ubuntu/react-admin/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    # 静态文件缓存，启用Cache-Control: max-age、Expires
    location ~ ^/static/.* {
        root /home/ubuntu/react-admin/build;
        expires 20y;
        access_log off;
        add_header Cache-Control "public";
    }
    # 代理ajax请求 前端ajax请求以/api开头
    location ^~/api {
       rewrite ^/api/(.*)$ /$1 break; # 如果后端接口不是统一以api开头，去掉api前缀
       proxy_pass http://api_service/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }

    # 子项目配置 访问地址 http://www.shubin.wang/project1
    location /project1 {
        root /home/ubuntu/react-admin;
        index index.html;
        try_files $uri $uri/ /project1/index.html;
    }
    # 静态文件缓存，启用Cache-Control: max-age、Expires
    location ~ ^/project1/static/.* {
        root /home/ubuntu/react-admin;
        expires 10y;
        access_log off;
        add_header Cache-Control "public";
    }
    # 代理ajax请求 前端ajax请求以 /project1_api 开头
    location ^~/project1_api {
       rewrite ^/api/(.*)$ /$1 break; # 如果后端接口不是统一以api开头，去掉api前缀
       proxy_pass http://api_service_project1/;
       proxy_set_header Host  $http_host;
       proxy_set_header Connection close;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-Server $host;
    }
}
```
