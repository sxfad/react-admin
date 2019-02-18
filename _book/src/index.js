import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as storage from '@/library/utils/storage';
import * as sxRedux from '@/library/redux';
import App from './App';
import handleSuccess from './commons/handle-success';
import handleError from './commons/handle-error';
import {configureStore} from './models';
import * as serviceWorker from './serviceWorker';
import {getLoginUser} from "./commons";
import './index.css';

// dev 模式开启mock
if (process.env.NODE_ENV === 'development') {
    require('./mock/index');
    console.log('current mode is development, mock is enabled');
}

const currentUser = getLoginUser() || {};

// 存储初始化 区分不同用户存储的数据
storage.init({
    keyPrefix: currentUser.id,
});

sxRedux.init({storage, handleError, handleSuccess});

// models store
const store = configureStore();

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
