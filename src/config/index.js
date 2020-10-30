import defaultConfig from './config.default';
import developmentConfig from './config.development';
import productionConfig from './config.production';
import testConfig from './config.test';

let config = {
    development: developmentConfig,
    test: testConfig,
    production: productionConfig,
};

const envConfig = config[process.env.NODE_ENV] || {};

export default {
    ...defaultConfig,
    ...envConfig,
};
