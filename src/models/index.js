import models from './models';
import handleSuccess from 'src/commons/handle-success';
import handleError from 'src/commons/handle-error';
import { storage, createStoreByModels } from '@ra-lib/admin';

const result = createStoreByModels(models, {
    // middlewares: [
    //     thunk,
    // ],
    // enhancers: [], // 与 middlewares 进行compose运算的方法： const enhancer = compose(applyMiddleware(...middlewares), ...enhancers);
    // reducers: {todos}, // 额外的reducers
    // localStorage: window.localStorage,
    // sessionStorage: window.sessionStorage,
    // serialize: JSON.stringify,
    // deserialize: JSON.parse,
    localStorage: storage.local,
    sessionStorage: storage.session,
    serialize: (data) => data,
    deserialize: (data) => data,
    onError: handleError,
    onSuccess: handleSuccess,
});

export const connect = result.connect;

/**
 * 导出 storage actions 给非组件环境使用
 const demoState = store.getState()?.demo
 const demoAction = actions.demo
 */
export const store = result.store;
export const actions = result.actions;
