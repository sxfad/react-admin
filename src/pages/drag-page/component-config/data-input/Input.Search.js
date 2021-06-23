import inputConfig from './Input';

export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        ...inputConfig.fields,
        {
            label: '确认按钮',
            field: 'enterButton',
            type: [
                {value: 'boolean', label: '是否'},
                {value: 'ReactNode', label: '组件'},
            ],
        },
        {
            label: '加载中',
            category: '选项',
            field: 'loading',
            type: 'boolean',
            defaultValue: false,
        },
    ],
};
