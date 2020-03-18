const paths = require('./paths');
// 给webstorm使用，查找路径使用
module.exports = {
    resolve: {
        alias: {
            'react-native': 'react-native-web',
            '@': paths.appSrc,
        },
    },
};
