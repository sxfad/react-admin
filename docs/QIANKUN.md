# 微前端

当前框架既可以作为乾坤主项目，又可以作为乾坤子项目

## 作为乾坤子系统时

**新创建子项目时注意修改 package.json 文件中 name 属性**

约定：package.json name 作为:

    - 子系统的BASE_NAME 
    - 子系统注册到主系统中的 name 、 activeRule
    - ant、ra-lib组件库class前缀

## 服务器设置

### 开发模式

- 开发devServer

```js
devServer: (devServerConfig, {env, paths, proxy, allowedHost}) => {
    if (!devServerConfig.headers) devServerConfig.headers = {};
    devServerConfig.headers['Access-Control-Allow-Origin'] = '*';
    return devServerConfig;
}
```

- 开发代理服务器

```js
module.exports = function(app) {
    app.use(proxy('/api',
        {
            target: 'http://172.16.40.72:8080',
            pathRewrite: {
                '^/api': '', // 如果后端接口无前缀，可以通过这种方式去掉
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
            // 作为子系统时，需要设置允许跨域
            onProxyRes(proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = '*';
                proxyRes.headers['Access-Control-Allow-Headers'] = '*';
            },
        },
    ));
};
```

### 生产（测试）部署

- nginx 配置

```
    # 如果是微前端子项目，要设置允许跨域
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods *;
    add_header Access-Control-Allow-Headers *;

    # 删除接口服务器header
    proxy_hide_header Access-Control-Allow-Origin;
    proxy_hide_header Access-Control-Allow-Methods;
    proxy_hide_header Access-Control-Allow-Headers;
```

- 后端接口服务

如果使用ng，在ng上设置即可，不需要特殊设置，如果前端直接请求后端接口服务，则需要设置跨域

## 乾坤微前端的坑

-[ ] 子系统卸载时，控制台会报提醒 `[qiankun] Set window.event while sandbox destroyed or inactive in xxx! `
