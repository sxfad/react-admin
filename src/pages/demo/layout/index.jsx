import {useState} from 'react';
import {Button, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';

export default config({
    path: '/demo/layout',
    // sideCollapsed: true,
    // header: false,
    // side: false,
    auth: false,
})(function TestAjax(props) {
    const [visible, setVisible] = useState(true);
    // 调用方法 会触发当前组件更新
    return (
        <PageContent>
            <Space>
                <Button onClick={() => setVisible(!visible)}>显示/隐藏</Button>
                <Button onClick={() => props.history.push('/users/11')}>编辑用户</Button>
            </Space>
        </PageContent>
    );
});

