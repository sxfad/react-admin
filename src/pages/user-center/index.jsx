import React from 'react';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';

export default config({
    path: '/users/:id',
})(function UserCenter(props) {

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
