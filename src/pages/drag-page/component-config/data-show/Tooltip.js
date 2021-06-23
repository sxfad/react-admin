export default {
    draggable: true,
    isWrapper: true,
    hooks: {
        afterPropsChange: options => {
            const {node, dragPageAction} = options;
            if (node?.props?.visible === false) {
                setTimeout(() => {
                    Reflect.deleteProperty(node.props, 'visible');

                    dragPageAction.render(true);
                });
            }
        },
    },
    fields: [
        {label: '显示', field: 'visible', type: 'boolean', version: '', desc: '提示信息'},
        {label: '提示信息', field: 'title', type: 'string', version: '', desc: '提示信息'},
        {
            label: '触发方式', field: 'trigger', type: 'radio-group', defaultValue: 'hover',
            options: [
                {value: 'click', label: '点击'},
                {value: 'hover', label: '悬停'},
                {value: 'focus', label: '聚焦'},
            ],
            version: '', desc: '提示信息',
        },
        {label: '气泡框位置', field: 'placement', type: 'placement', defaultValue: 'top'},
    ],
};
