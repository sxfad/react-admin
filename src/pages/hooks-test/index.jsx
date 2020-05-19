import React from 'react';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

export default config({
    path: '/hooks-test',
    title: 'config 函数式 用法',
})(props => {
    console.log(props);
    return (
        <PageContent>
            hooks page
        </PageContent>
    );
});
