export default {
    componentDisplayName: options => {
        const {node} = options;

        const textNode = node?.children?.find(item => item.componentName === 'Text');

        const text = textNode?.props?.text;

        if (text) return `Divider ${text}`;

        return 'Divider';
    },
    fields: [
        {label: '是否虚线', category: '选项', field: 'dashed', type: 'boolean', defaultValue: false, version: '', desc: '是否虚线'},
        {label: '文字为普通正文', category: '选项', field: 'plain', type: 'boolean', defaultValue: false, version: '4.2.0', desc: '文字是否显示为普通正文样式'},
        {
            label: '类型', field: 'type', type: 'radio-group', defaultValue: 'horizontal', version: '',
            options: [
                {value: 'horizontal', label: '水平'},
                {value: 'vertical', label: '垂直'},
            ],
            desc: '水平还是垂直类型',
        },
        {
            label: '标题位置', field: 'orientation', type: 'radio-group', defaultValue: 'center', version: '',
            options: [
                {value: 'left', label: '左'},
                {value: 'right', label: '右'},
                {value: 'center', label: '中间'},
            ],
            desc: '分割线标题的位置',
        },
    ],
};

/*
[
    {label:'分割线样式类',field:'className',type:'string',version:'',desc:'分割线样式类'},
    {label:'是否虚线',field:'dashed',type:'boolean',defaultValue:false,version:'',desc:'是否虚线'},
    {label:'分割线标题的位置',field:'orientation',type:'radio-group',defaultValue:'center',version:'',options:[{value:'left',label:'left'},{value:'right',label:'right'},{value:'center',label:'center'}],desc:'分割线标题的位置'},
    {label:'文字是否显示为普通正文样式',field:'plain',type:'boolean',defaultValue:false,version:'4.2.0',desc:'文字是否显示为普通正文样式'},
    {label:'分割线样式对象',field:'style',type:'CSSProperties',version:'',desc:'分割线样式对象'},
    {label:'水平还是垂直类型',field:'type',type:'radio-group',defaultValue:'horizontal',version:'',options:[{value:'horizontal',label:'horizontal'},{value:'vertical',label:'vertical'}],desc:'水平还是垂直类型'}
]
* */
