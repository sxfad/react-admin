import * as development from './config.development';
import * as production from './config.production';

let config = {
    development,
    production,
};

const env = process.env.REACT_APP_CONFIG_ENV || process.env.NODE_ENV;
const envConfig = config[env] || {};

export function getConfigValue(key, defaultValue, parse) {
    const evnKey = `REACT_APP_${key}`;
    // 命令行参数 优先级最高
    const envValue = process.env[evnKey];
    if (envValue !== void 0) {
        if (parse) return parse(envValue);
        if (envValue === 'true') return true;
        if (envValue === 'false') return false;

        return envValue;
    }

    // 区分环境配置
    const envConfigValue = envConfig[key];
    if (envConfigValue !== void 0) return envConfigValue;

    // 默认配置
    return defaultValue;
}
