const proxy = require('http-proxy-middleware');

// 前端web服务代理配置
module.exports = function(app) {
    app.use(proxy('/api',
        {
            // target: 'http://172.16.41.92:8080', // 孔健
            target: 'http://172.16.178.69:8080', // 测试
            pathRewrite: {
                '^/api': '', // 如果后端接口无前缀，可以通过这种方式去掉
            },
            changeOrigin: true,
            secure: false, // 是否验证证书
            ws: true, // 启用websocket
        },
    ));
};
