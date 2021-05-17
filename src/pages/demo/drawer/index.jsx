import {useState} from 'react';
import {Button, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import EditModal from './EditModal';

export default config({
    path: '/demo/drawer',
})(function TestAjax(props) {
    const [visible, setVisible] = useState(false);

    return (
        <PageContent>
            <Space>
                <Button onClick={() => setVisible(true)}>显示抽屉</Button>
            </Space>

            <EditModal
                loginUser="小哈"
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => console.log('onOk')}
            />
        </PageContent>
    );
});
