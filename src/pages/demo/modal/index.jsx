import {useState} from 'react';
import {Button, Modal, Space} from 'antd';
import config from 'src/commons/config-hoc';
import {PageContent} from '@ra-lib/components';
import EditModal from './EditModal';

export default config({
    path: '/demo/modal',
})(function TestAjax(props) {
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);

    return (
        <PageContent>
            <Space>
                <Button onClick={() => setVisible(true)}>显示弹框</Button>
                <Button onClick={() => setVisible2(true)}>显示弹框2</Button>
            </Space>

            <EditModal
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => console.log('onOk')}
            />

            <Modal
                title="标题"
                visible={visible2}
                onCancel={() => setVisible2(false)}
            >
                antd 原生 弹框
            </Modal>
        </PageContent>
    );
});
