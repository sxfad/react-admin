import ReactDOM from 'react-dom';
import { addGlobalUncaughtErrorHandler, registerMicroApps, start } from 'qiankun';
import { SubError } from './components';
import { getContainerId, PageContent } from '@ra-lib/admin';
import { CONFIG_HOC } from './config';
import api from 'src/api';
import App from './App';

/**
 * 获取当前激活子应用
 * @param pathname
 * @returns {Promise<*>}
 */
export async function getCurrentActiveSubApp(pathname = window.location.pathname) {
    const name = `${pathname.split('/')[1]}`;
    const subApps = await api.getSubApps();

    return subApps.find((item) => item.name === name);
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
    const apps = await api.getSubApps();

    return apps.find((item) => item.name === name);
}

export default async function () {
    // 获取子应用
    const subApps = await api.getSubApps();

    // 注册子应用
    registerMicroApps(subApps, {
        // 显示loading提示
        beforeLoad: (app) => {
            const { title = '子应用', name } = app;

            // 要通过App包裹，否则缺少必要环境
            ReactDOM.render(
                <App>
                    <PageContent loading fitHeight loadingTip={`${title}加载中...`} />
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
    addGlobalUncaughtErrorHandler((event) => {
        // 子应用加载失败
        if (event?.message?.includes('died in status LOADING_SOURCE_CODE')) {
            const name = event.error.appOrParcelName;
            ReactDOM.render(
                <App>
                    <SubError error={event} name={name} />
                </App>,
                document.getElementById(getContainerId(name)),
            );
        }
    });
}
