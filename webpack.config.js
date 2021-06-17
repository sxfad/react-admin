const path = require('path');

/**
 * 用于WebStorm 等IDE识别import使用，并不不是构建配置，
 * 构建配置在 craco.config.js 中
 * */
module.exports = {
    resolve: {
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
};
