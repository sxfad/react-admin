if (window.__POWERED_BY_QIANKUN__) {
    // 动态设置 webpack publicPath，防止资源加载出错

    const {PUBLIC_URL = ''} = process.env;

    let publicUrl = PUBLIC_URL.replace('/', '');

    if (publicUrl && !publicUrl.endsWith('/')) publicUrl = `${publicUrl}/`;

    // eslint-disable-next-line no-undef
    __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ + publicUrl;
}

/* eslint-disable import/first */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import {notification, message, Modal} from 'antd';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

function render(props = {}) {
    const {container} = props;
    const dom = container ? container.querySelector('#root') : document.querySelector('#root');

    ReactDOM.render(<App/>, dom);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if (!window.__POWERED_BY_QIANKUN__) {
    render();
}

export async function bootstrap() {
}

export async function mount(props) {
    render(props);
}

export async function unmount(props) {
    // 清理工作
    notification.destroy();
    message.destroy();
    Modal.destroyAll();

    const {container} = props;
    ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
}

