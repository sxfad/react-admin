import SXAjax, {createAjaxHoc} from 'src/library/ajax';
import mockUrls from '../mock/url-config';
import handleError from './handle-error';
import handleSuccess from './handle-success';

// 默认配置在这里设置
function getDefaultSettings(instance) {
    instance.defaults.baseURL = '/api';
    instance.defaults.timeout = 1000 * 60;
    instance.mockDefaults.baseURL = '/';
}

// ajax工具，含有errorTip 和 successTip
const _ajax = new SXAjax({
    onShowErrorTip: (error, errorTip) => handleError({error, errorTip}),
    onShowSuccessTip: (response, successTip) => handleSuccess({successTip}),
    isMock,
    reject: false,
});
getDefaultSettings(_ajax);

// ajax高阶组件
export const ajaxHoc = createAjaxHoc(_ajax);

// ajax工具，不含有 errorTip和successTip 一般models会使用
export const ajax = new SXAjax({isMock});
getDefaultSettings(ajax);

// mockjs使用的axios实例
export const mockInstance = ajax.mockInstance = _ajax.mockInstance;

// 请求前拦截
[ajax.instance, _ajax.instance].forEach(instance => {
    instance.interceptors.request.use(cfg => {
        // Do something before request is sent
        return cfg;
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });
});

// 判断请求是否是mock
function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}

