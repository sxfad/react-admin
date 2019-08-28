const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/api',
        {
            target: 'http://localhost:3000/',
            pathRewrite: {
                '^/api': '',
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        }
    ));
};
