import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as storage from 'src/library/utils/storage';
import App from './App';
import {store} from './models';
import * as serviceWorker from './serviceWorker';
import {getLoginUser} from './commons';
import './index.css';
import './mobile.css';

// dev 模式开启mock
if (process.env.NODE_ENV === 'development' || process.env.MOCK === 'true') {
    require('./mock/index');
    console.log('current mode is development, mock is enabled');
}

const currentUser = getLoginUser() || {};

// 存储初始化 区分不同用户存储的数据
storage.init({
    keyPrefix: currentUser.id,
});

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
