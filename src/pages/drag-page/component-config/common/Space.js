export default {
    withHolder: true,
    fields: [
        {
            label: '对齐方式', field: 'align', type: 'radio-group', version: '4.2.0',
            options: [
                {value: 'start', label: '开始'},
                {value: 'center', label: '居中'},
                {value: 'end', label: '结束'},
                {value: 'baseline', label: '基线'},
            ],
            desc: '对齐方式',
        },
        {
            label: '间距方向', field: 'direction', type: 'radio-group',
            defaultValue: 'horizontal',
            version: '4.1.0',
            options: [
                {value: 'vertical', label: '垂直'},
                {value: 'horizontal', label: '水平'}],
            desc: '间距方向',
        },
        {
            label: '间距大小', field: 'size',
            type: [
                {value: 'radio-group', label: '预设'},
                {value: 'number', label: '数值'},
            ],
            options: [
                {value: 'small', label: '小'},
                {value: 'middle', label: '中'},
                {value: 'large', label: '大'},
            ],
            defaultValue: 'small',
            version: '4.1.0 | Array: 4.9.0',

            desc: '间距大小',
        },
        {label: '设置拆分', field: 'split', type: 'ReactNode', version: '4.7.0', desc: '设置拆分'},
        {label: '是否自动换行', field: 'wrap', type: 'boolean', defaultValue: false, version: '4.9.0', desc: '是否自动换行，仅在 horizontal 时有效'},
    ],
};

/*
[
    {label:'对齐方式',field:'align',type:'radio-group',version:'4.2.0',options:[{value:'start',label:'start'},{value:'end |center |baseline',label:'end |center |baseline'}],desc:'对齐方式'},
    {label:'间距方向',field:'direction',type:'radio-group',defaultValue:'horizontal',version:'4.1.0',options:[{value:'vertical',label:'vertical'},{value:'horizontal',label:'horizontal'}],desc:'间距方向'},
    {label:'间距大小',field:'size',type:'radio-group',defaultValue:'small',version:'4.1.0 | Array: 4.9.0',options:[{value:'Size',label:'Size'},{value:'Size[]',label:'Size[]'}],desc:'间距大小'},
    {label:'设置拆分',field:'split',type:'ReactNode',version:'4.7.0',desc:'设置拆分'},
    {label:'是否自动换行，仅在 horizontal 时有效',field:'wrap',type:'boolean',defaultValue:false,version:'4.9.0',desc:'是否自动换行，仅在 horizontal 时有效'}
]
* */
