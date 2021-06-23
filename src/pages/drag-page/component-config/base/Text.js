import {FontSizeOutlined} from '@ant-design/icons';
import React from 'react';

export default {
    editableContents: [
        {
            propsField: 'text',
        },
    ],
    isContainer: false,
    icon: <FontSizeOutlined/>,
    fields: [
        {label: '文本内容', field: 'text', type: 'string'},
    ],
};
