import React from 'react';
import { Result } from 'antd';
import config from 'src/commons/config-hoc';
import { PageContent } from 'ra-lib';

export default config({ noFrame: true })(props => {

    return (
        <PageContent fitHeight style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Result
                status="404"
                title="404"
                subTitle="您访问的页面不存在"
            />
        </PageContent>
    );
});
