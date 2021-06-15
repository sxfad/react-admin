import {match} from 'path-to-regexp';
import {checkSameField, convertToTree, getQuery, sort} from '@ra-lib/util';
import options from 'src/options';
import {getSubApps, isActiveApp} from 'src/qiankun';
import {BASE_NAME, HASH_ROUTER} from 'src/config';
import pageConfigs from 'src/pages/page-configs';
import {Icon} from 'src/components';
import appPackage from '../../package.json';

const menuTargetOptions = options.menuTarget;
const TOKEN_STORAGE_KEY = `${appPackage.name}_token`;
const LOGIN_USER_STORAGE_KEY = `${appPackage.name}_login-user`;
let MAIN_APP = null;

/**
 * 设置乾坤主应用实例
 * @param mainApp
 */
export function setMainApp(mainApp) {
    MAIN_APP = mainApp;
    setLoginUser(mainApp?.loginUser || null);
}

/**
 * 获取乾坤主应用实例
 */
export function getMainApp() {
    return MAIN_APP;
}

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
    return query?.token
        || getMainApp()?.token
        || window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
        || getLoginUser()?.token;
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
    if (typeof code === 'boolean') return code;

    if (!code) return true;

    const loginUser = getLoginUser();
    return loginUser?.permissions?.includes(code);
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
    window.sessionStorage.setItem('loginUserId', loginUser.id);
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

    const mainAppToLogin = getMainApp()?.toLogin;

    if (mainAppToLogin) return mainAppToLogin();

    locationHref(loginPath);

    return null;
}

/**
 * 检测路由配置冲突
 * @param result
 * @returns {string|boolean}
 */
export async function checkPath(result) {
    const subApps = await getSubApps();

    const hasHome = result.some(({path}) => path === '/');
    if (!hasHome) throw Error(`必须含有首页路由，path: '/'， 如果需要其他页面做首页，可以进行 Redirect`);

    result
        .filter(({path}) => !!path)
        .forEach(({path, filePath}) => {
            // 是否与子项目配置冲突
            const app = subApps.find(item => isActiveApp(item, path));
            if (app) throw Error(`路由地址：「${path}」 与 子项目 「${app.title || app.name}」 激活规则配置冲突，对应文件文件如下：\n${filePath}`);

            // 自身路由配置是否冲突
            const exit = result.find(({filePath: f, path: p}) => {
                if (f === filePath) return false;

                if (!p || !path) return false;

                if (p === path) return true;

                return match(path, {decode: decodeURIComponent})(p)
                    || match(p, {decode: decodeURIComponent})(path);

            });
            if (exit) throw Error(`路由地址：「${path}」 与 「${exit.path}」 配置冲突，对应文件文件如下：\n${filePath}\n${exit.filePath}`);
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

/**
 * 处理菜单数据
 * @param menus
 * @returns {*}
 */
export function formatMenus(menus) {
    // id转字符串
    menus.forEach(item => {
        item.id = `${item.id}`;
        item.parentId = `${item.parentId}`;
    });
    // 检测是否有重复id
    const someId = checkSameField(menus, 'id');
    if (someId) throw Error(`菜单中有重复id 「 ${someId} 」`);

    // 排序 order降序， 越大越靠前
    return loopMenus(convertToTree(sort(menus, (a, b) => b.order - a.order)));
}

/**
 * 菜单数据处理函数{}
 * @param menus
 * @param basePath
 */
function loopMenus(menus, basePath) {
    menus.forEach(item => {
        let {icon, path, target, children} = item;

        // 保存原始target数据
        item._target = target;

        // 树状结构bashPath向下透传
        if (basePath && !('basePath' in item)) item.basePath = basePath;

        // 乾坤子项目约定
        if (target === menuTargetOptions.QIANKUN) item.basePath = `/${item.name}`;

        // 拼接基础路径
        if (basePath && path && (!path.startsWith('http') || !path.startsWith('//'))) {
            item.path = path = `${basePath}${path}`;
        }

        // 图标处理，数据库中持久换存储的是字符串
        if (icon) item.icon = <Icon type={icon}/>;

        // 第三方页面处理，如果target为iframe，内嵌到当前系统中
        if (target === menuTargetOptions.IFRAME) {
            // 页面跳转 : 内嵌iFrame
            item.path = `/iframe_page_/${encodeURIComponent(path)}`;
        }

        if (![menuTargetOptions.SELF, menuTargetOptions.BLANK].includes(target)) {
            Reflect.deleteProperty(item, 'target');
        }

        if (children?.length) loopMenus(children, item.basePath);
    });

    return menus;
}

