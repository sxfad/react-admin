export default {
    dropAccept: ['Col'],
    withHolder: true,
    componentDisplayName: ({node}) => {
        const count = node?.children?.filter(item => item.componentName === 'Col').length || 0;

        return `Row(${count}列)`;
    },

    fields: [
        {
            label: '垂直对齐', field: 'align', type: 'radio-group', defaultValue: 'top', version: '',
            options: [
                {value: 'top', label: '上对齐'},
                {value: 'middle', label: '居中对齐'},
                {value: 'bottom', label: '下对齐'},
            ],
            desc: '垂直对齐方式',
        },
        {
            label: '栅格水平间隔',
            field: 'gutter',
            type: 'number',
            defaultValue: '0',
            version: '',
            // TODO 多种类型支持
            options: [
                {value: 'number', label: 'number'},
                {value: 'object', label: 'object'},
                {value: 'array', label: 'array'},
            ],
            desc: '栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]',
        },
        {
            label: '水平对齐',
            field: 'justify',
            type: 'radio-group',
            defaultValue: 'start',
            version: '',
            options: [
                {value: 'start', label: '开始对齐'},
                {value: 'end', label: '结束对齐'},
                {value: 'center', label: '居中'},
                {value: 'space-around', label: '横向平分'},
                {value: 'space-between', label: '两端对齐'},
            ],
            desc: '水平排列方式',
        },
        {label: '自动换行', field: 'wrap', type: 'boolean', defaultValue: true, version: '4.8.0', desc: '是否自动换行'},
    ],
};
