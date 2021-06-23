import {FileImageOutlined} from '@ant-design/icons';
import React from 'react';

export default {
    icon: <FileImageOutlined/>,
    isContainer: false,

    fields: [
        {label: '图片地址', field: 'src', type: 'image'},
        {label: '图片宽度', field: 'width', type: 'unit'},
        {label: '图片高度', field: 'height', type: 'unit'},
        {label: '替代文本', field: 'alt', type: 'string'},
    ],
};
