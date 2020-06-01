import {useState, useEffect, useRef, useCallback} from 'react';

/**
 * ajax hooks
 *
 * 1. 提供loading
 * 2. 自动清除未完成请求
 *
 * @example
 const [loading, fetchDataSource] = useGet('/users', initOptions);

 // 一般情况下，调用时，传递参数即可
 await fetchDataSource(params);

 // 如果传递options，将与定义时的initOptions合并 {...initOptions, ...options}
 await fetchDataSource(params, options);

 // url携带参数的情况
 const [deleting, deleteOne] = useDel('/users/:id', options);

 // 单个站位参数，可以直接传递数据，多个要传递对象，key与url中的对应
 await deleteOne(1);

 // key 要与url中的对应
 await deleteOne({id});
 *
 * 存在的问题：
 *  由于loading是通过ajax的finally异步进行设置的，并不会跟调用者的setState进行合并，setLoading会单独触发一次render
 */
export default function createHooks(ajax) {
    const create = (method) => (url, initOptions = {}) => {
        const ajaxHandler = useRef(null);
        const [loading, setLoading] = useState(false);

        /**
         * 发起ajax请求的方法
         * @param params
         * @param options
         * @returns {Promise}
         */
        const handleAjax = useCallback((params, options = {}) => {
            // 处理url中的参数 「:id」或「{id}」
            // 将params中对应key的数据拼接到url上，并删除params中对应的参数
            const urls = url.split('/');
            const _url = urls.map(item => {
                if (!item.startsWith(':') && !item.startsWith('{')) return item;

                const key = item.replace(':', '').replace('{', '').replace('}', '');

                // 如果参数不是object 直接将params作为value
                if (typeof params !== 'object') {
                    const value = params;
                    params = null;

                    return value;
                }

                if (!(key in params)) throw Error(`缺少「${key}」参数`);

                const value = params[key];
                Reflect.deleteProperty(params, key);

                return value;
            }).join('/');

            setLoading(true);

            // ajaxToken 是一个promise
            // 此处真正发起的ajax请求
            const ajaxToken = ajax[method](_url, params, {reject: true, ...initOptions, ...options});

            ajaxHandler.current = ajaxToken;

            // 结束时，清除loading、清除token
            ajaxToken.finally(() => {
                setLoading(false);
                ajaxHandler.current = null;
            });

            return ajaxToken;
        }, [url]);

        useEffect(() => {
            return () => {
                // 组件被卸载，清除未完成的ajax请求
                // 对于hooks 不清除好像也不会报警告
                if (ajaxHandler.current) {
                    ajaxHandler.current.cancel();
                }
            };
        }, []);

        return [loading, handleAjax];
    };

    return {
        useGet: create('get'),
        usePost: create('post'),
        usePut: create('put'),
        useDel: create('del'),
    };
}
