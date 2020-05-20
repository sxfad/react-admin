import React, {useState, useEffect} from 'react';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

export default config({
    path: '/hooks-test',
    title: 'config 函数式 用法',
})(props => {
    // 每次组件更新，函数都会被调用一次，如果初始化相关数据，写到 useEffect didMount中

    let a = 123;
    console.log(props);
    let [count, setCount] = useState(0);

    // componentDidMount
    useEffect(() => {
        console.log(123);

        // componentWillUnmount
        return () => {
            console.log('unmount1');
        };
    }, []);

    // componentWillUnmount
    useEffect(() => () => console.log('unmount2'));

    // componentDidMount or componentDidUpdate
    useEffect(() => console.log('mounted or updated'));

    return (
        <PageContent>
            hooks page

            <div>a : {a}</div>
            <div>
                count: {count}
                <Button onClick={() => setCount(--count)}>-</Button>
                <Button onClick={() => setCount(++count)}>+</Button>
            </div>
        </PageContent>
    );
});
