/**
 * 如果函数有参数，不会被缓存！！！
 * @param options
 * @param cacheTime
 *      false 不缓存
 *      true 浏览器刷新之后失效
 *      number 缓存number毫秒数，可以有效解决同一页面多次加载问题同时一定程度上避免脏数据
 * @returns {*}
 */
export function wrapper(options, cacheTime) {
    // 异步请求缓存字典
    const cacheMap = new Map();

    // 处理缓存
    if (cacheTime !== false) {
        Object.entries(options)
            .forEach(([key, item]) => {
                if (typeof item === 'function') {
                    options[key] = function newItem(...args) {
                        // 如果有参数，不缓存
                        if (args?.length) return item(...args);

                        let cache = cacheMap.get(newItem);
                        if (!cache) {
                            cache = item();
                            cacheMap.set(newItem, cache);

                            if (typeof cacheTime === 'number') {
                                setTimeout(() => cacheMap.delete(newItem), cacheTime);
                            }
                        }
                        return cache;
                    };
                }
            });
    }

    // 添加方法
    options.clearCache = () => {
        Object.values(options).forEach(item => cacheMap.delete(item));
    };
    Object.values(options)
        .forEach(item => {
            item.getOption = (value) => getField(item, value);
            item.getLabel = (value) => getField(item, value, 'label');
            item.getMeta = (value) => getField(item, value, 'meta');
            item.clearCache = () => cacheMap.delete(item);
        });

    function getField(item, value, field) {
        let opts = item;

        if (typeof item === 'function') {
            opts = cacheMap.get(item) || item();
        }

        if (Array.isArray(opts)) {
            const result = opts.find(i => i.value === value) || {};
            return field ? result[field] : result;
        }
        // 异步结果
        if (opts.then) {
            return opts.then(it => {
                const result = it.find(i => i.value === value) || {};
                return field ? result[field] : result;
            });
        }
    }

    return options;
}
