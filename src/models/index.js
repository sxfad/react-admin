import {createStore, applyMiddleware, combineReducers, bindActionCreators} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {
    middlewareUtils,
    createConnectHOC,
    middlewarePromise,
    connect as _connect,
    getActionsAndReducers,
    middlewareAsyncActionCallback,
    middlewareSyncReducerToLocalStorage,
    init,
} from 'src/library/redux';
import models from './models';
import * as storage from '../library/utils/storage';
import handleError from '../commons/handle-error';
import handleSuccess from '../commons/handle-success';

init({storage, handleError, handleSuccess});

const {actions, reducers} = getActionsAndReducers({models});
const middleware = [
    thunkMiddleware,
    middlewarePromise,
    middlewareAsyncActionCallback,
    middlewareUtils,
    middlewareSyncReducerToLocalStorage,
];

const _store = configureStore();
const {dispatch} = _store;

const _action = bindActionCreators(actions, dispatch);
Object.keys(actions).forEach(key => {
    if (typeof actions[key] === 'object') {
        _action[key] = bindActionCreators(actions[key], dispatch);
    }
});

/**
 *
 * 在普通js文件中
 *  可以通过store.getState获取到数据
 *  可以通过action.side.hide(); 修改数据
 */
export const store = _store;
export const action = _action;

export function configureStore(initialState) {
    return applyMiddleware(...middleware)(createStore)(combineReducers(reducers), initialState);
}

// 与redux进行连接 函数
export const connectComponent = _connect({actions, options: {ref: true}});

// 与redux进行连接 装饰器
export const connect = createConnectHOC(connectComponent);

// 使用action的hooks
export const useAction = () => _action;

// 数据直接使用 useSelector
