import { useState } from 'react';
import { Modal, Button } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import s from './style.less';

export default function Generator() {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <Button type="primary" className={s.root} shape={'circle'} onClick={() => setVisible(!visible)}>
                <CodeOutlined />
            </Button>
            <Modal
                className={s.modal}
                visible={visible}
                bodyStyle={{
                    width: '100vw',
                    height: '100vh',
                    padding: 0,
                }}
                footer={null}
                closable={false}
            >
                <iframe title="代码生成器" src="/dev-ra-gen" frameBorder="0" width="100%" height="100%" />
            </Modal>
        </>
    );
}
