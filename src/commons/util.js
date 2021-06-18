import {queryParse, Storage} from '@ra-lib/util';
import appPackage from '../../package.json';

/**
 * 不含有当前项目任何依赖的工具方法！！！
 * 不要引入项目中文件，防止循环引入问题！！！
 * */

const PACKAGE_NAME = appPackage.name;
const LOGIN_USER_STORAGE_KEY = `${PACKAGE_NAME}_login_user`;
const LOGIN_USER_ID_STORAGE_KEY = `${PACKAGE_NAME}_login_user_id`;
const LOGIN_USER_TOKEN_STORAGE_KEY = `${PACKAGE_NAME}_login_user_token`;
const MAIN_APP_KEY = `${PACKAGE_NAME}_main_app`;

const userId = window.sessionStorage.getItem(LOGIN_USER_ID_STORAGE_KEY);
const STORAGE_PREFIX = `${PACKAGE_NAME}_${userId || ''}_`;

/**
 * 前端存储对象 storage.local storage.session storage.global
 * storage.local.setItem(key, value) storage.local.getItem(key, value)
 * @type {Storage}
 */
export const storage = new Storage({prefix: STORAGE_PREFIX});

/**
 * 存储token到sessionStorage及loginUser中
 * @param token
 */
export function setToken(token) {
    window.sessionStorage.setItem(LOGIN_USER_TOKEN_STORAGE_KEY, token);
}

/**
 * 获取token
 * token来源: queryString > sessionStorage > loginUser
 */
export function getToken() {
    const query = queryParse();
    if (query?.token) setToken(query.token);
    return query?.token
        || window.sessionStorage.getItem(LOGIN_USER_TOKEN_STORAGE_KEY);
}

/**
 * 设置当前用户信息
 * @param loginUser 当前登录用户信息
 */
export function setLoginUser(loginUser = {}) {
    // 必须字段
    [
        'id',
        'name',
        'token',
        // 'permissions',
    ].forEach(field => {
        if (!loginUser[field]) throw Error(`loginUser must has ${field} property!`);
    });

    // 将用户属性在这里展开，方便查看系统都用到了那些用户属性
    const userStr = JSON.stringify({
        id: loginUser.id,                   // 用户id 必须
        name: loginUser.name,               // 用户名 必须
        avatar: loginUser.avatar,           // 用头像 非必须
        token: loginUser.token,             // 登录凭证 非必须 ajax请求有可能会用到，也许是cookie
        permissions: loginUser.permissions, // 用户权限 如果控制权限，必传
        ...loginUser,
    });

    window.sessionStorage.setItem(LOGIN_USER_STORAGE_KEY, userStr);
    window.sessionStorage.setItem(LOGIN_USER_ID_STORAGE_KEY, loginUser.id);
    window.sessionStorage.setItem(LOGIN_USER_TOKEN_STORAGE_KEY, loginUser.token);
}

/**
 * 获取当前用户信息
 * @returns {any}
 */
export function getLoginUser() {
    const loginUser = window.sessionStorage.getItem(LOGIN_USER_STORAGE_KEY);

    return loginUser ? JSON.parse(loginUser) : undefined;
}

/**
 * 判断是否有权限
 * @param code
 */
export function hasPermission(code) {
    if (typeof code === 'boolean') return code;

    if (!code) return true;

    const loginUser = getLoginUser();
    return loginUser?.permissions?.includes(code);
}

/**
 * 判断用户是否登录 前端简单通过登录用户或token是否存在来判断
 * @returns {boolean}
 */
export function isLogin() {
    // 前端判断是否登录，基于不同项目，可能需要调整
    return !!(
        getLoginUser()
        || window.sessionStorage.getItem('token')
        || window.localStorage.getItem('token')
        || getMainApp()?.token
    );
}

/**
 * 判断当前页面是否是登录页面
 * @param path
 * @returns {string|*|boolean}
 */
export function isLoginPage(path) {
    if (!path) path = window.location.href;
    return path && path.endsWith('/login');
}

/**
 * 设置乾坤主应用实例
 * @param mainApp
 */
export function setMainApp(mainApp) {
    storage.global.setItem(MAIN_APP_KEY, mainApp);
    setLoginUser(mainApp?.loginUser || null);
    setToken(mainApp?.token || mainApp?.loginUser?.token);
}

/**
 * 获取乾坤主应用实例
 */
export function getMainApp() {
    return storage.global.getItem(MAIN_APP_KEY);
}

/**
 * 获取配置
 * @param envConfig
 * @param key
 * @param defaultValue
 * @param parse
 * @returns {string|boolean|*}
 */
export function getConfigValue(envConfig, key, defaultValue, parse) {
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

