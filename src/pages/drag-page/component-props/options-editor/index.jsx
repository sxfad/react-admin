import React, {useState} from 'react';
import {Button} from 'antd';
import EditorModal from './EditorModal';

export default function OptionsEditor(props) {
    const [visible, setVisible] = useState(false);
    const {value, onChange, withLabel = true} = props;

    return (
        <>
            <Button
                block
                type="primary"
                onClick={() => setVisible(true)}
            >
                点击编辑
            </Button>
            <EditorModal
                withLabel={withLabel}
                value={value}
                onChange={onChange}
                visible={visible}
                onCancel={() => setVisible(false)}
            />
        </>
    );
}
