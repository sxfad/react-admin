import {useEffect, useState} from 'react';
// 项目中可能用到的一些枚举类数据
// 约定只含有三个参数，其他数据通过record存储：{value: 1, label: '名称', record: {}};

// 是否
useOptions.yesNo = [
    {value: true, label: '是'},
    {value: false, label: '否'},
];

// 性别
useOptions.sex = [
    {value: '1', label: '男'},
    {value: '2', label: '女'},
    {value: '3', label: '未知'},
];

// 可以是函数，异步或同步都可以
useOptions.menu = async () => {
    return [
        {value: '1', label: '用户管理'},
        {value: '2', label: '菜单管理'},
    ];
};

useOptions.action = async () => {

    throw Error('获取失败了');
};

export default function useOptions(...args) {
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

                    // 检测是否只含有 value label record? 三个参数
                    options.filter(item => !!item).forEach(arr => arr.forEach(obj => {
                        const keys = Object.keys(obj);
                        if (keys.length > 3 || (keys.length === 3 && !keys.includes('record')))
                            throw Error('枚举类型数据，只能含有 value,label,record 三个属性！\n' + JSON.stringify(obj, null, 4));

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
