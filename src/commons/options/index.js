import {useEffect, useState} from 'react';

/**
 * 项目中可能用到的一些枚举类数据
 * 约定只含有三个参数，
 * {
 *  value: 1,      // 必须且不可重复
 *  label: '名称', // 必须
 *  meta: {},     // 其他数据，可缺省
 * };
 * */

// 异步请求缓存字典
const cacheMap = new Map();
// const cacheTime = false; // 不使用缓存
// const cacheTime = true; // 一直保持，刷新失效
const cacheTime = 1000; // 缓存指定时间，毫秒，可以有效防止短时间内多次请求，又可避免脏数据

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
        {value: true, label: '是'},
        {value: false, label: '否'},
    ],
    // 性别
    sex: [
        {value: '1', label: '男'},
        {value: '2', label: '女'},
        {value: '3', label: '未知'},
    ],
    // 可以是函数，异步或同步都可以
    async menu() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {value: '1', label: '用户管理' + Date.now()},
                    {value: '2', label: '菜单管理' + Date.now()},
                ]);
            }, 1500);
        });
    },
    action() {
        return [
            {value: 'add', label: '添加'},
        ];
        // throw Error('获取失败了');
    },
    clearCache() {
        console.log('清除缓存');
        Object.values(options).forEach(item => cacheMap.delete(item));
        console.log(cacheMap);
    },
};

// 处理缓存
if (cacheTime !== false) {
    Object.entries(options)
        .forEach(([key, item]) => {
            if (typeof item === 'function') {
                options[key] = function newItem() {
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

export default options;

export function useOptions(...args) {
    const [result, setResult] = useState([]);
    useEffect(() => {
        (async () => {
            const functions = args.map(item => {
                if (typeof item === 'function') {

                    const res = item();
                    // 异步函数结果
                    if (res.then) return res;

                    // 同步函数结果
                    return Promise.resolve(res);
                }

                // 不是函数，原样返回
                return Promise.resolve(item);
            });
            Promise.allSettled(functions)
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
