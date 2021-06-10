import {LAYOUT_TYPE} from '@ra-lib/components';
import {getConfigValue} from './util';
import storage from 'src/commons/storage';
import appPackage from '../../package.json';

/**
 * 所有配置均可通过命令行参数传递，需要添加 REACT_APP_ 前缀，比如：REACT_APP_CONFIG_ENV=test yarn build
 * 配置优先级 命令行 > 环境文件 > 默认
 * 当前文件为默认配置，会被环境配置、命令行参数覆盖
 * */

// 是否作为为前端主应用
export const IS_MAIN_APP = getConfigValue('IS_MAIN_APP', true);
// 应用名称
export const APP_NAME = getConfigValue('APP_NAME', 'React Admin');
// 页面路由前缀
export const BASE_NAME = getConfigValue('BASE_NAME', window.__POWERED_BY_QIANKUN__ ? `/${appPackage.name}` : '');
// 是否使用hash路由
export const HASH_ROUTER = getConfigValue('HASH_ROUTER', false);
// ajax 请求前缀
export const AJAX_PREFIX = getConfigValue('AJAX_PREFIX', window.__POWERED_BY_QIANKUN__ ? `${window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__}api` : '/api');
// ajax 超时时间
export const AJAX_TIMEOUT = getConfigValue('AJAX_TIMEOUT', 1000 * 60, Number);
// 静态文件前缀
export const PUBLIC_URL = getConfigValue('PUBLIC_URL', '');
// 运行环境
export const NODE_ENV = process.env.NODE_ENV;
// 配置环境
export const CONFIG_ENV = process.env.REACT_APP_CONFIG_ENV;
// 是否是开发环境
export const IS_DEV = getConfigValue('IS_DEV', NODE_ENV === 'development');
// 是否作为乾坤子项目，或者嵌入在iframe中
export const IS_SUB = getConfigValue('IS_SUB', window.__POWERED_BY_QIANKUN__ || window.self !== window.top);
// 是否是手机布局
export const IS_MOBILE = getConfigValue('IS_MOBILE', window.document.body.clientWidth <= 575);
// config-hoc 配置存储key
export const CONFIG_HOC_STORAGE_KEY = 'CONFIG_HOC_STORAGE_KEY';
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
    header: IS_MOBILE,
    // 侧边栏是否显示
    side: !IS_MOBILE,
    // Tabs是否显示
    tab: !IS_MOBILE,
    // 持久化 Tabs记录
    persistTab: true,
    // tab左侧显示展开收起菜单按钮
    tabSideToggle: true,
    // tab右侧显示额外头部内容
    tabHeaderExtra: true,
    // 页面头部是否显示
    pageHeader: false,
    // 头部主题
    headerTheme: IS_MOBILE ? 'dark' : 'default', // default
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
    // PageContent组件 fitHeight 时，计算高度所用到的额外高度值，如果页面显示统一的footer，这里设置footer的高度
    pageOtherHeight: 0, // 默认footer高度 26

    ...(storage.local.getItem(CONFIG_HOC_STORAGE_KEY) || {}),
};
