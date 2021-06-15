import {useEffect, useState} from 'react';
import {Tag} from 'antd';
import ajax from 'src/commons/ajax';

/**
 * 项目中可能用到的一些枚举类数据
 * 约定只含有三个参数，
 * {
 *  value: 1,      // 必须且不可重复
 *  label: '名称', // 必须
 *  meta: {},     // 其他数据，可缺省
 *  tag: Tag      // 标签
 * };
 * */
const options = {
    // 菜单目标
    get menuTarget() {
        const menuTargetOptions = [
            {value: 'menu', label: '应用菜单'},
            {value: 'qiankun', label: '乾坤子应用'},
            {value: 'iframe', label: 'iframe内嵌第三方'},
            {value: '_self', label: '当前窗口打开第三方'},
            {value: '_blank', label: '新开窗口打开第三方'},
        ];
        // 定义一些常量，避免判断时硬编码
        menuTargetOptions.MENU = 'menu';
        menuTargetOptions.QIANKUN = 'qiankun';
        menuTargetOptions.IFRAME = 'iframe';
        menuTargetOptions.SELF = '_self';
        menuTargetOptions.BLANK = '_blank';

        return menuTargetOptions;
    },
    // 是否
    yesNo: [
        {value: true, label: '是', tag: <Tag color="green">是</Tag>},
        {value: false, label: '否', tag: <Tag color="red">否</Tag>},
    ],
    // 启用、禁用
    enable: [
        {value: true, label: '启用', tag: <Tag color="green">启用</Tag>},
        {value: false, label: '禁用', tag: <Tag color="red">禁用</Tag>},
    ],
    // 性别
    sex: [
        {value: '1', label: '男'},
        {value: '2', label: '女'},
        {value: '3', label: '未知'},
    ],
    async system() {
        const list = await ajax.get('/systems');
        return list.map(item => {
            return {
                value: item.id,
                label: item.title,
                meta: item,
            };
        });
    },
    // 可以是函数，异步或同步都可以
    async menu() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {value: '1', label: '用户管理' + Date.now()},
                    {value: '2', label: '菜单管理' + Date.now()},
                ]);
            }, 1000);
        });
    },
    action() {
        return [
            {value: 'add', label: '添加'},
        ];
        // throw Error('获取失败了');
    },
};

wrapper(options, 1000 * 5);

export default options;

export function useOptions(...args) {
    const [result, setResult] = useState([]);
    useEffect(() => {
        (async () => {
            const promises = args.map(item => {
                if (typeof item === 'function') {

                    const res = item();
                    // 异步函数结果
                    if (res.then) return res;

                    // 同步函数结果
                    return Promise.resolve(res);
                }

                if (item.then) return item;

                // 不是函数，原样返回
                return Promise.resolve(item);
            });
            Promise.allSettled(promises)
                .then(results => {
                    const options = results.map(item => {
                        if (item.status === 'fulfilled') {
                            return item.value;
                        } else {
                            console.error(item.reason);
                            return [];
                        }
                    });

                    // 检测是否只含有 value label meta? 三个参数
                    options.filter(item => !!item).forEach(arr => arr.forEach(obj => {
                        const keys = Object.keys(obj);
                        if (keys.length > 3 || (keys.length === 3 && !keys.includes('meta')))
                            throw Error('枚举类型数据，只能含有 value,label,meta 三个属性！\n' + JSON.stringify(obj, null, 4));

                        if (!keys.includes('value') || !keys.includes('label'))
                            throw Error('枚举类型数据，必须含有 value,label 属性！\n' + JSON.stringify(obj, null, 4));
                    }));

                    setResult(options);
                });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return result;
}

/**
 * 如果函数有参数，不会被缓存！！
 * ！
 * @param options
 * @param cacheTime
 *      false 不缓存
 *      true 浏览器刷新之后失效
 *      number 缓存number毫秒数，可以有效解决同一页面多次加载问题同时一定程度上避免脏数据
 * @returns {*}
 */
function wrapper(options, cacheTime) {
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
            item.getTag = (value) => getField(item, value, 'tag');
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
