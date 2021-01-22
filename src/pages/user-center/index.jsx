import React from 'react';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';

export default config({
    path: '/users/:id',
    title: {text: '用户中心', icon: 'user'},
    side: false,
})(function UserCenter() {
    return (
        <PageContent fitHeight>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
            }}>
                <h1>用户中心</h1>
                <p>敬请期待</p>
            </div>
        </PageContent>
    );
});
