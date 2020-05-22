import React, {useState} from 'react';
import {useEffectOnce, useLifecycles, useMount, useUnmount, useMap} from 'react-use';
import {Button} from 'antd';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

export default config({
    path: '/react-use',
    title: 'React Use',
})(props => {
    // 每次组件更新，函数都会被调用一次，如果初始化相关数据，写到 useEffect didMount中
    console.log('react-use');

    useMount(() => {
        console.log('useMount');
    });

    useUnmount(() => {
        console.log('useUnmount');
    });

    useEffectOnce(() => {
        // componentDidMount
        console.log('useEffectOnce mount');

        return () => {
            // componentWillUnmount
            console.log('useEffectOnce unmount');
        };
    });

    useLifecycles(() => {
        // componentDidMount
        console.log('useLifecycles mount');
    }, () => {
        // componentWillUnmount
        console.log('useLifecycles unmount');
    });

    let [count, setCount] = useState(0);
    const [state, stater] = useMap({
        hello: 'there',
    });


    return (
        <PageContent>
            hooks page
            <div>
                <button onClick={() => stater.set(String(Date.now()), new Date().toJSON())}>
                    Add
                </button>
                <button onClick={() => stater.reset()}>
                    Reset
                </button>
                <button onClick={() => stater.set('hello', '123')}>
                    Set new data
                </button>
                <button onClick={() => {
                    state.age = 23;
                    stater.setAll({...state});
                }}>
                    Set new data and clear others
                </button>
                <button onClick={() => stater.remove('hello')} disabled={!state.hello}>
                    Remove 'hello'
                </button>
                <pre>{JSON.stringify(state, null, 2)}</pre>
            </div>
            <div>
                count: {count}
                <Button onClick={() => setCount(--count)}>-</Button>
                <Button onClick={() => setCount(++count)}>+</Button>
            </div>
        </PageContent>
    );
});
