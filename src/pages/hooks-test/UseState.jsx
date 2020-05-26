import React, {useState, useEffect} from 'react';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

export default config({
    path: '/use-state',
    title: 'Use State',
})(() => {
    // 每次组件更新，函数都会被调用一次
    console.log('use state');

    const [a, setA] = useState({});
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);

    function handleSearch() {
        console.log('a: ', a);
        console.log('b: ', b);
        console.log('c: ', c);
    }

    useEffect(() => {
        handleSearch();
    }, [
        a,
        b,
        c,
    ]);
    return (
        <PageContent>
            <div>
                <Button onClick={() => {
                    // setState在原生事件，setTimeout，setInterval，Promise等异步操作中，state会同步更新
                    // 在React环境之外就会同步更新

                    // 只会触发一次render
                    // setA({name: '张三', age: 12});
                    // setB(Math.random());
                    // setC(1);

                    const p = new Promise((resolve) => {
                        resolve(1);
                    });

                    // promise 回调中触发三次
                    p.then(() => {
                        setA({name: '张三', age: 12});
                        setB(Math.random());
                        setC(1);
                    });

                    // 放到setTimeout中就会触发3次render
                    // 定时器中的setState没走react的事物机制，执行时批量更新没被设置true，所以每次都直接render了。
                    // 原生事件和定时器一样
                    // React 事件中会走事务机制

                    // setTimeout(() => {
                    //     setA({name: '张三', age: 12});
                    //     setB(Math.random());
                    //     setC(1);
                    // });
                }}>同时设置ABC</Button>

                <Button onClick={() => {
                    setA(2);
                    setA(3);
                    setA(4);
                    setA(5);
                }}>多次设置A</Button>
            </div>
        </PageContent>
    );
});
