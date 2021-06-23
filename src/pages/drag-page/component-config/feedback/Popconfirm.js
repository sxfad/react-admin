import {buttonTypeOptions} from '../options';

export default {
    isContainer: false,
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
        {label: '显示', category: '选项', field: 'visible', type: 'boolean', version: '', desc: '提示信息'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '提示信息'},
        {label: '提示内容', field: 'title', type: 'string', version: '', desc: '提示信息'},
        {label: '确认按钮文字', field: 'okText', type: 'string'},
        {label: '确认按钮类型', field: 'okType', type: 'radio-group', options: buttonTypeOptions},
        {label: '取消按钮文字', field: 'cancelText', type: 'string'},
        {label: '气泡框位置', field: 'placement', type: 'placement', defaultValue: 'top'},
    ],
};
