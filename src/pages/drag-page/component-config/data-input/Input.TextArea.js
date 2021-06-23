export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        {label: '可清空', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: false, version: '', desc: '可以点击清除图标删除内容'},
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '4.5.0', desc: '是否有边框'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用状态，默认为 false'},
        {
            label: '展示字数',
            category: '选项',
            field: 'showCount',
            type: 'boolean',
            defaultValue: false,
            version: '4.7.0 (formatter: 4.10.0)',
            desc: '是否展示字数',
        },
        {label: '输入框提示', field: 'placeholder', type: 'string', version: ''},
        {label: '行数', field: 'rows', type: 'number'},

        // {
        //     label: '内容高度',
        //     field: 'autoSize',
        //     type: [
        //         {value: 'boolean', label: '自适应'},
        //         {
        //             value: 'object', label: '指定',
        //             fields: [
        //                 {label: '最小行数', field: 'minRows', type: 'number', defaultValue: 2},
        //                 {label: '最大行数', field: 'maxRows', type: 'number', defaultValue: 6},
        //             ],
        //         },
        //     ],
        //     defaultValue: false,
        //     version: '',
        //     options: [{value: 'boolean', label: 'boolean'}, {value: 'object', label: 'object'}],
        //     desc: '自适应内容高度，可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }',
        // },

        {label: '内容最大长度', field: 'maxLength', type: 'number', version: '4.7.0', desc: '内容最大长度'},
    ],
};

/*
[
    {label:'可以点击清除图标删除内容',field:'allowClear',type:'boolean',defaultValue:false,version:'',desc:'可以点击清除图标删除内容'},
    {label:'自适应内容高度，可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }',field:'autoSize',type:'radio-group',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'object',label:'object'}],desc:'自适应内容高度，可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'4.5.0',desc:'是否有边框'},
    {label:'指定字数展示的格式',field:'countFormatter',type:'(count: number, maxLength?: number) => string',version:'4.10.0',desc:'指定字数展示的格式'},
    {label:'输入框默认内容',field:'defaultValue',type:'string',version:'',desc:'输入框默认内容'},
    {label:'内容最大长度',field:'maxLength',type:'number',version:'4.7.0',desc:'内容最大长度'},
    {label:'是否展示字数',field:'showCount',type:'radio-group',defaultValue:'false',version:'4.7.0 (formatter: 4.10.0)',options:[{value:'boolean',label:'boolean'},{value:'{ formatter: ({ count: number, maxLength?: number }) => string }',label:'{ formatter: ({ count: number, maxLength?: number }) => string }'}],desc:'是否展示字数'},
    {label:'输入框内容',field:'value',type:'string',version:'',desc:'输入框内容'},
    {label:'按下回车的回调',field:'onPressEnter',type:'function(e)',version:'',desc:'按下回车的回调'},
    {label:'resize 回调',field:'onResize',type:'function({ width, height })',version:'',desc:'resize 回调'}
]
* */
