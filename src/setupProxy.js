const proxy = require('http-proxy-middleware');

// 前端web服务代理配置
module.exports = function(app) {
    app.use(proxy('/api',
        {
            target: 'http://localhost:8080',
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

    app.use(proxy('/portal',
        {
            target: 'http://172.16.143.44:32328', // 测试门户后端
            pathRewrite: {
                '^/portal': '',
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        },
    ));
};
