import * as development from './config.development';
import * as production from './config.production';
import appPackage from '../../package.json';
import {storage, getConfigValue as gc, LAYOUT_TYPE} from '@ra-lib/admin';

const allEnvConfig = {development, production};
const env = process.env.REACT_APP_CONFIG_ENV || process.env.NODE_ENV;
const envConfig = allEnvConfig[env] || {};
const getConfigValue = (key, defaultValue, parse = value => value) => gc(envConfig, key, defaultValue, parse);

/**
 * 所有配置均可通过命令行参数传递，需要添加 REACT_APP_ 前缀，比如：REACT_APP_CONFIG_ENV=test yarn build
 * 配置优先级 命令行 > 环境文件 > 默认
 * 当前文件为默认配置，会被环境配置、命令行参数覆盖
 * */
// 运行环境
export const NODE_ENV = process.env.NODE_ENV;

// 应用名称
export const APP_NAME = getConfigValue('APP_NAME', 'React Admin');

// ajax 请求前缀
const useLocalStorage = NODE_ENV === 'development' || window.location.hostname === '172.16.143.44';
export const AJAX_PREFIX = useLocalStorage ? (window.localStorage.getItem('AJAX_PREFIX') || '/api') : getConfigValue('AJAX_PREFIX', window.__POWERED_BY_QIANKUN__ ? `${window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__}api` : '/api');

// ajax 超时时间
export const AJAX_TIMEOUT = getConfigValue('AJAX_TIMEOUT', 1000 * 60, Number);

// 配置环境
export const CONFIG_ENV = process.env.REACT_APP_CONFIG_ENV;
// config-hoc 配置存储key
export const CONFIG_HOC_STORAGE_KEY = 'CONFIG_HOC_STORAGE_KEY';
// 是否有系统概念，顶级菜单将作为系统，角色有系统概念，默认添加子系统管理员角色
export const WITH_SYSTEMS = getConfigValue('WITH_SYSTEMS', false);
// 页面路由前缀
export const BASE_NAME = getConfigValue('BASE_NAME', window.__POWERED_BY_QIANKUN__ ? `/${appPackage.name}` : '');
// 是否使用hash路由
export const HASH_ROUTER = getConfigValue('HASH_ROUTER', false);
// 静态文件前缀
export const PUBLIC_URL = getConfigValue('PUBLIC_URL', '');
// 是否是开发环境
export const IS_DEV = getConfigValue('IS_DEV', NODE_ENV === 'development');
// 是否作为乾坤子项目，或者嵌入在iframe中
export const IS_SUB = getConfigValue('IS_SUB', window.__POWERED_BY_QIANKUN__ || window.self !== window.top);
// 是否是手机布局
export const IS_MOBILE = getConfigValue('IS_MOBILE', window.document.body.clientWidth <= 575);

const mobileConfig = IS_MOBILE ? {
    layoutType: LAYOUT_TYPE.SIDE_MENU,
    header: true,
    side: false,
    tab: false,
    headerTheme: 'dark',
} : {};

// config-hoc 高阶组件、布局默认配置
export const CONFIG_HOC = {
    // 是否需要登录
    auth: true,
    // props是否注入ajax
    ajax: true,
    // 是否与model连接
    connect: true,
    // 启用页面保持功能，无特殊需求，尽量不要开启
    keepAlive: false,
    // layout布局方式 LAYOUT_TYPE.SIDE_MENU LAYOUT_TYPE.TOP_MENU LAYOUT_TYPE.TOP_SIDE_MENU
    layoutType: LAYOUT_TYPE.SIDE_MENU,
    // 头部是否显示
    header: true,
    // 侧边栏是否显示
    side: true,
    // Tabs是否显示
    tab: false,
    // 持久化 Tabs记录
    persistTab: true,
    // tab左侧显示展开收起菜单按钮
    tabSideToggle: true,
    // tab右侧显示额外头部内容
    tabHeaderExtra: true,
    // tab高度
    tabHeight: 40,
    // 页面头部是否显示
    pageHeader: false,
    // 头部主题
    headerTheme: 'default', // dark
    // 侧边栏主题
    sideTheme: 'dark', // dark
    // logo主题
    logoTheme: 'dark',
    // 侧边栏展开宽度
    sideMaxWidth: 210,
    // 头部显示菜单展开收起按钮
    headerSideToggle: true,
    // 保持菜单展开状态
    keepMenuOpen: true,
    // 左侧菜单是否收起
    sideCollapsed: false,
    // 是否显示搜索菜单
    searchMenu: true,
    // 是否显示我的收藏菜单
    showCollectedMenus: true,
    // PageContent组件 fitHeight 时，计算高度所用到的额外高度值，如果页面显示统一的footer，这里设置footer的高度
    pageOtherHeight: 0, // 默认footer高度 26

    ...mobileConfig,
    ...(storage.local.getItem(CONFIG_HOC_STORAGE_KEY) || {}),
};
