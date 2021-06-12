import ReactDOM from 'react-dom';
import {
    addGlobalUncaughtErrorHandler,
    registerMicroApps,
    start,
} from 'qiankun';
import {PageContent} from '@ra-lib/components';
import {SubError} from 'src/components';
import {getLoginUser, getToken, toLogin} from 'src/commons';
import {CONFIG_HOC} from 'src/config';
import getMenus from 'src/menus';
import App from 'src/App';
import options from 'src/options';

const menuTargetOptions = options.menuTarget;

/**
 * 获取子应用列表
 */
export async function getSubApps() {
    // 传递给子应用的数据
    const props = {
        mainApp: {
            toLogin,
            loginUser: getLoginUser(),
            token: getToken(),
        },
    };

    // 从菜单数据中获取需要注册的乾坤子项目
    const menuTreeData = await getMenus() || [];
    let result = [];
    const loop = nodes => nodes.forEach(node => {
        const {_target, children} = node;
        if (_target === menuTargetOptions.QIANKUN) {
            const {title, name, entry} = node;
            result.push({
                title,
                name,
                entry,
                activeRule: !CONFIG_HOC.keepAlive ? `/${name}` : () => {
                    // 当前路径是子应用，或者 子应用容器存在
                    return isActiveApp({name}) || !!document.getElementById(getContainerId(name));
                },
                container: `#${getContainerId(name)}`,
                props,
            });
        }
        if (children?.length) loop(children);
    });
    loop(menuTreeData);

    return result;
}

/**
 * 获取当前激活子应用
 * @param pathname
 * @returns {Promise<*>}
 */
export async function getCurrentActiveSubApp(pathname = window.location.pathname) {
    const name = `${pathname.split('/')[1]}`;
    const subApps = await getSubApps();

    return subApps.find(item => item.name === name);
}

/**
 * 根据name判断，是否是激活子项目
 * @param app
 * @param pathname
 * @returns {*}
 */
export function isActiveApp(app, pathname = window.location.pathname) {
    return pathname.startsWith(`/${app.name}`);
}

/**
 * 根据name 获取app配置
 * @param name
 */
export async function getAppByName(name) {
    const apps = await getSubApps();

    return apps.find(item => item.name === name);
}

/**
 * 获取子应用容器id
 * @param name
 * @returns {string}
 */
export function getContainerId(name) {
    return `_sub_app_id__${name}`;
}

export default async function() {
    // 获取子应用
    const subApps = await getSubApps();

    // 注册子应用
    registerMicroApps(subApps, {
        beforeLoad: (app) => {
            const {title = '子应用', name} = app;

            // 要通过App包裹，否则缺少必要环境
            ReactDOM.render(
                <App>
                    <PageContent loading fitHeight loadingTip={`${title}加载中...`}/>
                </App>,
                document.getElementById(getContainerId(name)),
            );
        },
    });

    // 启动应用
    start({
        // 是否同时只加载一个应用
        singular: !CONFIG_HOC.keepAlive,
        // 是否预加载
        prefetch: false,
    });

    // 全局错误处理
    addGlobalUncaughtErrorHandler(event => {
        // 子应用加载失败
        if (event?.message?.includes('died in status LOADING_SOURCE_CODE')) {
            const name = event.error.appOrParcelName;
            ReactDOM.render(
                <App>
                    <SubError error={event} name={name}/>
                </App>,
                document.getElementById(getContainerId(name)),
            );
        }
    });
}
