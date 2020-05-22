import React, {useState, useEffect} from 'react';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

export default config({
    path: '/hooks-effect',
    title: 'config 函数式 用法',
})(props => {
    console.log('render');

    const [random, setRandom] = useState(Math.random());

    let [count, setCount] = useState(0);

    useEffect(() => {
        console.log('useEffect');

        return () => {
            console.log('useEffect return');
        };
    });

    return (
        <PageContent>
            Use Effect

            <div>
                count: {count}
                <Button onClick={() => setCount(--count)}>-</Button>
                <Button onClick={() => setCount(++count)}>+</Button>

                <div>
                    random: {random}
                    <Button onClick={() => setRandom(Math.random())}>随机数</Button>
                </div>

            </div>
        </PageContent>
    );
});
