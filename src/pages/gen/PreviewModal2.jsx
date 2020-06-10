import React from 'react';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

export default config({
    modal: {
        title: '弹框标题',
    },
})(props => {
    const {onOk, onCancel} = props;

    return (
        <ModalContent
            onOk={onOk}
            onCancel={onCancel}
        >
            弹框内容
        </ModalContent>
    );
});
