# 开发代理
开发时，要与后端进行接口对接，可以通过代理与后端进行连接，开发代理配置在`src/setupProxy.js`中编写

```js
const proxy = require('http-proxy-middleware');

const prefix = process.env.AJAX_PREFIX || '/api';

module.exports = function (app) {
    app.use(proxy(prefix,
        {
            target: 'http://localhost:3000/',
            pathRewrite: {
                ['^' + prefix]: '', // 如果后端接口无前缀，可以通过这种方式去掉
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        },
    ));
};

```

注：更多代理配置请参考[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)


前端默认ajax前缀 /api 可以通过 AJAX_PREFIX 参数进行修改。

