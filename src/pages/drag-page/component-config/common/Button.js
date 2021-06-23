import {targetOptions, buttonTypeOptions} from '../options';

export default {
    isContainer: false,
    renderAsDisplayName: true,
    componentDisplayName: options => {
        const {node} = options;

        const textNode = node?.children?.find(item => item.componentName === 'Text');

        const text = textNode?.props?.text;

        if (text) return `Button ${text}`;

        return 'Button';
    },
    fields: [
        {
            label: '按钮类型', field: 'type', type: 'radio-group', defaultValue: 'default', version: '',
            options: buttonTypeOptions,
            desc: '设置按钮类型',
        },
        {label: '危险', category: '选项', categoryOrder: 1, field: 'danger', type: 'boolean', defaultValue: false, version: '', desc: '设置危险按钮'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '按钮失效状态'},
        {label: '加载中', category: '选项', field: 'loading', type: 'boolean', defaultValue: false, version: '', desc: '设置按钮载入状态'},
        {
            label: '按钮形状', field: 'shape', type: 'radio-group', version: '',
            options: [
                {value: 'circle', label: '原型'},
                {value: 'round', label: '圆角'},
            ],
            desc: '设置按钮形状',
        },
        {
            label: '按钮大小', field: 'size', type: 'radio-group', defaultValue: 'middle', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'small', label: '小号'},
            ],
            desc: '设置按钮大小',
        },
        {
            label: '图标',
            field: 'icon',
            type: 'ReactNode',
            version: '',
            desc: '设置按钮的图标组件',
        },
        {label: '幽灵', category: '选项', field: 'ghost', type: 'boolean', defaultValue: false, version: '', desc: '幽灵属性，使按钮背景透明'},
        {label: '撑满', category: '选项', field: 'block', type: 'boolean', defaultValue: false, version: '', desc: '将按钮宽度调整为其父宽度的选项'},
        {label: '跳转地址', field: 'href', type: 'string', version: '', desc: '点击跳转的地址，指定此属性 button 的行为和 a 链接一致'},
        {
            label: '跳转目标', appendField: 'href', field: 'target', type: 'radio-group', version: '', desc: '相当于 a 链接的 target 属性，href 存在时生效',
            options: targetOptions,
        },
        {label: 'htmlType', field: 'htmlType', type: 'string', defaultValue: 'button', version: '', desc: '设置 button 原生的 type 值，可选值请参考 HTML 标准'},
        {label: '点击事件', field: 'onClick', type: 'function', version: '', desc: '点击按钮时的回调'},
    ],
};
