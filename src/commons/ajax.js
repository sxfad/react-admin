import SXAjax, {createAjaxHoc} from '@/library/ajax';
import mockUrls from '../mock/url-config';
import handleError from './handle-error';
import handleSuccess from './handle-success';

/**
 * 判断请求是否是mock
 * @param url
 * @returns {boolean|*}
 */
export function isMock(url /* url, data, method, options */) {
    return mockUrls.indexOf(url) > -1 || url.startsWith('/mock');
}

/**
 * ajax工具，含有errorTip 和 successTip
 * @type {SXAjax}
 */
export const sxAjax = new SXAjax({
    onShowErrorTip: (error, errorTip) => handleError({error, errorTip}),
    onShowSuccessTip: (response, successTip) => handleSuccess({successTip}),
    isMock,
});

// 默认配置
sxAjax.defaults.baseURL = '/api';
sxAjax.defaults.timeout = 1000 * 60;
sxAjax.mockDefaults.baseURL = '/';

/**
 * ajax高阶组件
 */
export const ajaxHoc = createAjaxHoc(sxAjax);

/**
 * ajax工具，不含有 errorTip和successTip
 * @type {SXAjax}
 */
export const ajax = new SXAjax({
    isMock,
});

// 默认配置
ajax.defaults.baseURL = '/api';
ajax.defaults.timeout = 1000 * 5;

// 请求前拦截
[ajax.instance, sxAjax.instance].forEach(instance => {
    instance.interceptors.request.use(cfg => {
        // Do something before request is sent
        return cfg;
    }, error => {
        // Do something with request error
        return Promise.reject(error);
    });
});


/**
 * mockjs使用的axios实例
 */
export const mockInstance = ajax.mockInstance = sxAjax.mockInstance;

