import React from 'react';
import {Result} from 'antd';
import {PageContent} from '@ra-lib/components';

export default function Error404(props) {
    return (
        <PageContent
            fitHeight
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="您访问的页面不存在"
            />
        </PageContent>
    );
}
