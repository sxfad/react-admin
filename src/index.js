if (window.__POWERED_BY_QIANKUN__) {
    // 动态设置 webpack publicPath，防止资源加载出错

    const { PUBLIC_URL = '' } = process.env;

    let publicUrl = PUBLIC_URL.replace('/', '');

    if (publicUrl && !publicUrl.endsWith('/')) publicUrl = `${publicUrl}/`;

    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + publicUrl;
}
/* eslint-disable import/first */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import { notification, Modal, message } from 'antd';
import App from './App';
import { setMainApp } from '@ra-lib/admin';
import qiankun from './qiankun';

// 开启mock，这个判断不要修改，否则会把mock相关js打入生产包，很大
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_MOCK) {
    require('./mock/index');
    console.warn('mock is enabled!!!');
}

function getRootDom(props) {
    const rootId = '#root';
    const { container } = props;
    return container ? container.querySelector(rootId) : document.querySelector(rootId);
}

function render(props = {}) {
    ReactDOM.render(<App />, getRootDom(props));
}

// 单独运行时，渲染
if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

// 乾坤主应用
qiankun();

// 作为乾坤子应用
export async function bootstrap(props) {}

export async function mount(props) {
    setMainApp(props.mainApp);
    render(props);
}

export async function unmount(props) {
    // 清理工作
    notification.destroy();
    message.destroy();
    Modal.destroyAll();

    ReactDOM.unmountComponentAtNode(getRootDom(props));
}
