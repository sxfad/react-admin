import SXAjax, { createHoc, createHooks } from 'src/library/ajax';
import mockUrls from '../mock/url-config';
import handleError from './handle-error';
import handleSuccess from './handle-success';
import cfg from 'src/config';

const { ajaxPrefix, ajaxTimeout } = cfg;

// 默认配置在这里设置
export function withDefaultSettings(instance) {
    instance.defaults.baseURL = ajaxPrefix;
    instance.defaults.timeout = ajaxTimeout;
    instance.mockDefaults.baseURL = '/';
    // instance.defaults.headers['XXX-TOKEN'] = 'token-value';
    // instance.defaults.headers.get['token'] = 'token-value';
    return instance;
}

// ajax工具，含有errorTip 和 successTip
const _ajax = withDefaultSettings(new SXAjax({
    onShowErrorTip: (error, errorTip) => handleError({ error, errorTip }),
    onShowSuccessTip: (response, successTip) => handleSuccess({ successTip }),
    isMock,
    reject: true,
}));

// ajax工具，不含有 errorTip和successTip 一般models会使用
const __ajax = withDefaultSettings(new SXAjax({ isMock }));

// hooks
const {
    useGet: _useGet,
    useDel: _useDel,
    usePost: _usePost,
    usePut: _usePut,
    usePatch: _usePatch,
} = createHooks(_ajax);
/*
// 请求响应拦截
[ __ajax.instance, _ajax.instance ].forEach(instance => {
    // 请求拦截
    instance.interceptors.request.use(cfg => {
        // Do something before request is sent
        return cfg;
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });

    // 响应拦截
    instance.interceptors.response.use(res => {
        // Do something before response
        return res;
    }, error => {
        // Do something with response error
        return Promise.reject(error);
    });
});
*/

// 判断请求是否是mock
function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}

// hooks
export const useGet = _useGet;
export const useDel = _useDel;
export const usePost = _usePost;
export const usePut = _usePut;
export const usePatch = _usePatch;

// ajax高阶组件
export const ajaxHoc = createHoc(_ajax);

// ajax工具，不含有 errorTip和successTip 一般models会使用
export const ajax = __ajax;

// mockjs使用的axios实例
export const mockInstance = __ajax.mockInstance = _ajax.mockInstance;
