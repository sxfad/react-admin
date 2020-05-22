import React, {useState, useEffect} from 'react';
import config from '../../commons/config-hoc';
import PageContent from '../../layouts/page-content';
import {Button} from 'antd';

const useAjax = (options) => {
    // 利用对象的引用，时卸载时能拿到所有的数据，并不需要setState操作，setState反而会引发当前函数重新再调用一遍
    const [ajaxHandle] = useState([]);

    useEffect(() => {

        return () => {
            // 组件被卸载，清除未完成的ajax请求

            console.log('打断所有ajax请求：', ajaxHandle);
        };
    }, []);

    return {
        get: () => {
            ajaxHandle.push('新的ajax' + Math.random());

            console.log('ajaxHandle ', ajaxHandle);

            // return ajax.get;

            return Promise.resolve(Math.random());
        },
    };

};

export default config({
    // path: '/hooks-ajax',
    title: 'ajax hooks 封装',
})(props => {
    const ajax = useAjax();
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        const result = await ajax.get();
        setResult(result);
    };

    useEffect(async () => {
        await handleSearch();
    }, []);

    return (
        <PageContent>
            <Button onClick={handleSearch}>发请求</Button>
            <div>useAjax result: {result};</div>
        </PageContent>
    );
});
