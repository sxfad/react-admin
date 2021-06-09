const proxy = require('http-proxy-middleware');

// 前端web服务代理配置
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
            // onProxyReq (proxyReq, req, res) {
            // },
            onProxyRes(proxyRes, req, res) {
                proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                proxyRes.headers['Access-Control-Allow-Methods'] = '*';
                proxyRes.headers['Access-Control-Allow-Headers'] = '*';
            },
        },
    ));
};
