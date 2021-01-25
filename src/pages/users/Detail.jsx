import React, {useEffect} from 'react';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';

export default config({
    path: '/users/detail/:id',
    title: props => `详情-${props.match.params.id}`,
})(function Detail(props) {
    console.log(props);
    useEffect(() => {
        console.log('用户详情加载了');
        return () => {
            console.log('用户详情卸载了');
        };
    }, []);

    return (
        <PageContent>
            用户详情
        </PageContent>
    );
});
