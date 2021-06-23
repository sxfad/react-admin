import inputConfig from './Input';

export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        ...inputConfig.fields,
        {
            label: '密码切换',
            category: '选项',
            field: 'visibilityToggle',
            type: 'boolean',
            defaultValue: true,
        },
    ],
};
