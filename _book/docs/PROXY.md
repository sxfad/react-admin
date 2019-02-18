# 开发代理
开发时，要与后端进行接口对接，可以通过代理与后端进行连接，开发代理配置在`src/setupProxy.js`中编写

```js
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api', // 代理以api开头的请求，可以基于自己的实际项目需求进行更改
        {
            target: 'http://localhost:3000/',
            pathRewrite: { // 如果后端接口不是统一以api开头，去掉api
                '^/api': '',
            },
        }
    ));
};
```

注：更过代理配置请参考[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
