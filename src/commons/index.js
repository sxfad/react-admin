import {match} from 'path-to-regexp';
import {BASE_NAME, HASH_ROUTER} from 'src/config';
import pageConfigs from 'src/pages/page-configs';
import {Storage, getQuery} from '@ra-lib/util';

const TOKEN_STORAGE_KEY = 'token';
const LOGIN_USER_STORAGE_KEY = 'login-user';
const STORAGE_PREFIX = `${getLoginUser()?.id || ''}_`;

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
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
    const loginUser = getLoginUser();
    if (loginUser) loginUser.token = token;
}

/**
 * 获取token
 * token来源: queryString > sessionStorage > loginUser
 */
export function getToken() {
    const query = getQuery();
    if (query?.token) {
        window.sessionStorage.setItem(TOKEN_STORAGE_KEY, query.token);
    }
    return query?.token || window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || getLoginUser()?.token;
}

/**
 * 浏览器跳转，携带baseName hash等
 * @param href
 * @returns {string|*}
 */
export function locationHref(href) {
    if (href?.startsWith('http')) return window.location.href = href;

    if (href && BASE_NAME && href.startsWith(BASE_NAME)) href = href.replace(BASE_NAME, '');

    const hash = HASH_ROUTER ? '#' : '';

    return window.location.href = `${BASE_NAME}${hash}${href}`;
}

/**
 * 判断是否有权限
 * @param code
 */
export function hasPermission(code) {
    const loginUser = getLoginUser();
    return loginUser?.permissions?.includes(code);
}

/**
 * 设置当前用户信息
 * @param loginUser 当前登录用户信息
 */
export function setLoginUser(loginUser = {}) {
    if (!loginUser?.id) throw Error('loginUser must has id property!');
    if (!loginUser?.name) throw Error('loginUser must has name property!');

    // 将用户属性在这里展开，方便查看系统都用到了那些用户属性
    const {id, name, avatar, token, permissions, ...others} = loginUser;
    const userStr = JSON.stringify({
        id,             // 用户id 必须
        name,           // 用户名 必须
        avatar,         // 用头像 非必须
        token,          // 登录凭证 非必须 ajax请求有可能会用到，也许是cookie
        permissions,    // 用户权限
        ...others,      // 其他属性
    });

    window.sessionStorage.setItem(LOGIN_USER_STORAGE_KEY, userStr);
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
 * 判断用户是否登录 前端简单通过登录用户或token是否存在来判断
 * @returns {boolean}
 */
export function isLogin() {
    // 前端判断是否登录，基于不同项目，可能需要调整
    return !!getLoginUser()
        || window.sessionStorage.getItem('token')
        || window.localStorage.getItem('token');
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
 * 进入首页
 */
export function toHome() {
    // 跳转页面，优先跳转上次登出页面
    let lastHref = window.sessionStorage.getItem('last-href') || '/';

    // 如果上次是登录页面，直接跳转首页
    if (isLoginPage(lastHref)) lastHref = '/';

    locationHref(lastHref);
}

/**
 * 跳转到登录页面
 */
export function toLogin() {
    const loginPath = '/login';

    // 判断当前页面是否已经是login页面，如果是，直接返回，不进行跳转，防止出现跳转死循环
    if (isLoginPage()) return null;

    // 清除相关数据
    window.sessionStorage.clear();
    window.sessionStorage.setItem('last-href', window.location.href);

    locationHref(loginPath);

    return null;
}


/**
 * 检测路由配置冲突
 * @param result
 * @returns {string|boolean}
 */
export function checkPath(result) {
    result
        .filter(({path}) => !!path)
        .forEach(({path, filePath}) => {
            const exit = result.find(({filePath: f, path: p}) => {
                if (f === filePath) return false;

                if (!p || !path) return false;

                if (p === path) return true;

                return match(path, {decode: decodeURIComponent})(p)
                    || match(p, {decode: decodeURIComponent})(path);

            });
            if (exit) {
                throw Error(`路由地址：${path} 与 ${exit.path} 配置冲突，对应文件文件如下：\n${filePath}\n${exit.filePath}`);
            }
        });
}


/**
 * 基于 window.location.pathname pageConfig 获取当前页面config高级组件参数
 * @returns {{}|*}
 */
export function getCurrentPageConfig() {
    let {pathname, hash} = window.location;
    if (HASH_ROUTER) {
        pathname = hash.replace('#', '').split('?')[0];
    } else if (BASE_NAME) {
        pathname = pathname.replace(BASE_NAME, '');
    }

    const config = pageConfigs.find(({path}) => path && match(path, {decode: decodeURIComponent})(pathname));

    return config || {};
}
