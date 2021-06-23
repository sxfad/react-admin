import {targetOptions} from '../options';
import {LinkOutlined} from '@ant-design/icons';
import React from 'react';

export default {
    icon: <LinkOutlined/>,
    fields: [
        {label: '跳转地址', field: 'href', type: 'string'},
        {
            label: '目标', field: 'target', type: 'radio-group',
            options: targetOptions,
        },
    ],
};
