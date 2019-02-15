/** * * * * * * * * * * * * * * * * * * * * * * **
 *                    _ooOoo_                    *
 *                   o8888888o                   *
 *                   88" . "88                   *
 *                   (| -_- |)                   *
 *                   O\  =  /O                   *
 *                ____/`---'\____                *
 *              .'  \\|     |//  `.              *
 *             /  \\|||  :  |||//  \             *
 *            /  _||||| -:- |||||-  \            *
 *            |   | \\\  -  /// |   |            *
 *            | \_|  ''\---/''  |   |            *
 *            \  .-\__  `-`  ___/-. /            *
 *          ___`. .'  /--.--\  `. . __           *
 *       ."" '<  `.___\_<|>_/___.'  >'"".        *
 *      | | :  `- \`.;`\ _ /`;.`/ - ` : | |      *
 *      \  \ `-.   \_ __\ /__ _/   .-` /  /      *
 * ======`-.____`-.___\_____/___.-`____.-'====== *
 *                    `=---='                    *
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ *
 *             佛祖保佑       永无BUG              *
 *         此代码经过开光处理，不可能存在bug！        *
 * * * * * * * * * * * * * * * * * * * * * * * **/

import axios from 'axios';
import {stringify} from 'qs';

export default class SXAjax {
    /**
     * 构造函数传入的是自定义的一些配置，
     * axios相关的全局配置使用sxAjax实例进行配置：
     * sxAjax.defaults.xxx sxAjax.mockDefaults.xxx进行配置
     *
     * @param onShowErrorTip 如何显示错误提示
     * @param onShowSuccessTip 如何显示成功提示
     * @param isMock 区分哪些请求需要mock，比如：url以约定'/mock'开头的请求，使用mock等方式。
     */
    constructor({
                    onShowSuccessTip = (/* response, successTip  */) => true,
                    onShowErrorTip = (/* err, errorTip */) => true,
                    isMock = (/* url, data, method, options */) => false,
                } = {}) {
        this.instance = axios.create();
        this.mockInstance = axios.create();
        this.setDefaultOption(this.instance);
        this.setDefaultOption(this.mockInstance);
        this.defaults = this.instance.defaults;
        this.mockDefaults = this.mockInstance.defaults;

        this.onShowSuccessTip = onShowSuccessTip;
        this.onShowErrorTip = onShowErrorTip;
        this.isMock = isMock;
    }

    setDefaultOption(instance) {
        instance.defaults.timeout = 10000;
        // instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        // instance.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        instance.defaults.headers.post['Content-Type'] = 'application/json';
        instance.defaults.headers.put['Content-Type'] = 'application/json';
        instance.defaults.baseURL = '/';
        instance.defaults.withCredentials = true; // 跨域携带cookie
    }

    /**
     *
     * @param url
     * @param d
     * @param method
     * @param options 配置数据，最常用是【successTip】属性，也可以吧url data method覆盖掉；
     * @returns {Promise}
     */
    ajax(url, d = {}, method = 'get', options = {}) {
        // 有 null的情况
        let data = d || {};
        options = options || {};

        let {
            successTip = false, // 默认false，不展示
            errorTip, //  = method === 'get' ? '获取数据失败！' : '操作失败！', // 默认失败提示
            noEmpty = false,
        } = options;

        // 删除 参数对象中为 null '' undefined 的数据，不发送给后端
        if (noEmpty === true && typeof data === 'object' && !Array.isArray(data)) {
            const noEmptyData = {};

            Object.keys(data).forEach(key => {
                const value = data[key];
                if (value !== null && value !== '' && value !== void 0) {
                    noEmptyData[key] = value;
                }
            });

            data = noEmptyData;
        }

        const CancelToken = axios.CancelToken;
        let cancel;

        const isGet = method === 'get';
        const isMock = this.isMock(url, data, method, options);

        let instance = this.instance;

        /*
         * 封装内不做处理，如果需要，通过如下方式，或者其他方法自行处理
         * axiosInstance.interceptors.request.use(cfg => {
         *   // Do something before request is sent
         *   return cfg;
         * }, error => {
         *   // Do something with request error
         *   return Promise.reject(error);
         * });
         *
         * */

        if (isMock) {
            instance = this.mockInstance;
        }

        /*
        *
        * Content-Type application/x-www-form-urlencoded 存在问题
        * 参见：https://github.com/axios/axios/issues/362
        *
        * */
        const defaultsContentType = instance.defaults.headers[method]['Content-Type'] || '';
        const contentType = (options.headers && options.headers['Content-Type']) || '';
        if (
            (defaultsContentType && defaultsContentType.indexOf('application/x-www-form-urlencoded') > -1)
            || contentType.indexOf('application/x-www-form-urlencoded') > -1
        ) {
            data = stringify(data);
        }

        let params = {};
        if (isGet) {
            params = data; // params 是get请求拼接到url上的
            data = {}; // data 是put、post 等请求发送的数据
        }

        const ajaxPromise = new Promise((resolve, reject) => {
            instance({
                method,
                url,
                data,
                params,
                cancelToken: new CancelToken(c => cancel = c),
                ...options,
            }).then(response => {
                this.onShowSuccessTip(response, successTip);
                resolve(response.data, response);
            }, err => {
                const isCanceled = err && err.message && err.message.canceled;
                if (isCanceled) return; // 如果是用户主动cancel，不做任何处理，不会触发任何函数
                this.onShowErrorTip(err, errorTip);
                reject(err);
            }).catch(error => {
                reject(error);
            });
        });
        ajaxPromise.cancel = function () {
            cancel({
                canceled: true,
            });
        };
        return ajaxPromise;
    }

    /**
     * 发送一个get请求，一般用于查询操作
     * @param {string} url 请求路径
     * @param {object} [params] 传输给后端的数据，正常请求会转换成query string 拼接到url后面
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    get(url, params, options) {
        return this.ajax(url, params, 'get', options);
    }

    /**
     * 发送一个post请求，一般用于添加操作
     * @param {string} url 请求路径
     * @param {object} [data] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    post(url, data, options) {
        return this.ajax(url, data, 'post', options);
    }


    /**
     * 发送一个put请求，一般用于更新操作
     * @param {string} url 请求路径
     * @param {object} [data] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    put(url, data, options) {
        return this.ajax(url, data, 'put', options);
    }

    /**
     * 发送一个patch请求，一般用于更新部分数据
     * @param {string} url 请求路径
     * @param {object} [data] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    patch(url, data, options) {
        return this.ajax(url, data, 'patch', options);
    }

    /**
     * 发送一个delete请求，一般用于删除数据，params会被忽略（http协议中定义的）
     * @param {string} url 请求路径
     * @param {object} [data] 传输给后端的数据
     * @param {object} [options] axios 配置参数
     * @returns {Promise}
     */
    del(url, data, options) {
        return this.ajax(url, data, 'delete', options);
    }
}
