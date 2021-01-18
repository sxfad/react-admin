import defaultConfig from './config.default';
import developmentConfig from './config.development';
import productionConfig from './config.production';
import testConfig from './config.test';

let config = {
    development: developmentConfig,
    test: testConfig,
    production: productionConfig,
};

const env = process.env.CONFIG_ENV || process.env.NODE_ENV;

const envConfig = config[env] || {};

export default {
    ...defaultConfig,
    ...envConfig,
};
