import * as development from './config.development';
import * as production from './config.production';

/**
 * 配置文件，最好不要引用任何其他依赖
 * */

const allEnvConfig = {development, production};
const env = process.env.REACT_APP_CONFIG_ENV || process.env.NODE_ENV;
const envConfig = allEnvConfig[env] || {};

// 是否有系统概念，顶级菜单将作为系统，角色有系统概念，默认添加子系统管理员角色
export const WITH_SYSTEMS = getConfigValue('WITH_SYSTEMS', true);
// 应用名称
export const APP_NAME = getConfigValue('APP_NAME', 'React Admin');

// ajax相关配置
export const AJAX = {
    baseURL: '/api',
    timeout: 60 * 1000,
    // 相应拦截，可以根据后端约定，进行错误处理
    onResponse: res => res,
};

export const CONFIG_HOC = {
    // pageOtherHeight: 0, // 默认footer高度 26
};


/**
 * 获取配置
 * @param key
 * @param defaultValue
 * @param parse
 * @returns {string|boolean|*}
 */
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
