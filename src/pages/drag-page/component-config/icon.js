import React from 'react';
import * as antdIcon from '@ant-design/icons';

const antdIconConfig = {};
Object.keys(antdIcon)
    .filter((key, index) => {
        return /^[A-Z]/.test(key);
    })
    .forEach(key => {
        const Icon = antdIcon[key];
        antdIconConfig[key] = {
            isContainer: false,
            icon: <Icon/>,
            propsToSet: {
                icon: {
                    componentName: key,
                },
            },
            fields: [
                {label: '颜色', field: ['style', 'color'], type: 'color', version: '', desc: '图标颜色'},
                {label: '大小', field: ['style', 'fontSize'], type: 'unit', version: '', desc: '图标大小'},
            ],
        };
    });

export default {
    ...antdIconConfig,
};
