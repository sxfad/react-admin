export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        {label: '可清空', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: false, version: '', desc: '可以点击清除图标删除内容'},
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '4.5.0', desc: '是否有边框'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用状态，默认为 false'},
        {label: '输入框提示', field: 'placeholder', type: 'string', version: ''},
        {label: '前置标签', field: 'addonBefore', type: 'ReactNode', version: '', desc: '带标签的 input，设置前置标签'},
        {label: '后置标签', field: 'addonAfter', type: 'ReactNode', version: '', desc: '带标签的 input，设置后置标签'},
        {label: '前缀图标', field: 'prefix', type: 'ReactNode', version: '', desc: '带有前缀图标的 input'},
        {label: '后缀图标', field: 'suffix', type: 'ReactNode', version: '', desc: '带有后缀图标的 input'},
        {
            label: '控件大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '控件大小。注：标准表单内的输入框大小限制为 large',
        },
    ],
};

/*
[
    {label:'带标签的 input，设置后置标签',field:'addonAfter',type:'ReactNode',version:'',desc:'带标签的 input，设置后置标签'},
    {label:'带标签的 input，设置前置标签',field:'addonBefore',type:'ReactNode',version:'',desc:'带标签的 input，设置前置标签'},
    {label:'可以点击清除图标删除内容',field:'allowClear',type:'boolean',version:'',desc:'可以点击清除图标删除内容'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'4.5.0',desc:'是否有边框'},
    {label:'输入框默认内容',field:'defaultValue',type:'string',version:'',desc:'输入框默认内容'},
    {label:'是否禁用状态，默认为 false',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'是否禁用状态，默认为 false'},
    {label:'输入框的 id',field:'id',type:'string',version:'',desc:'输入框的 id'},
    {label:'最大长度',field:'maxLength',type:'number',version:'',desc:'最大长度'},
    {label:'带有前缀图标的 input',field:'prefix',type:'ReactNode',version:'',desc:'带有前缀图标的 input'},
    {label:'控件大小。注：标准表单内的输入框大小限制为 large',field:'size',type:'radio-group',version:'',options:[{value:'large',label:'large'},{value:'middle',label:'middle'},{value:'small',label:'small'}],desc:'控件大小。注：标准表单内的输入框大小限制为 large'},
    {label:'带有后缀图标的 input',field:'suffix',type:'ReactNode',version:'',desc:'带有后缀图标的 input'},
    {label:'声明 input 类型，同原生 input 标签的 type 属性，见：MDN(请直接使用 Input.TextArea 代替 type=\\'textarea\\')',field:'type',type:'string',defaultValue:'text',version:'',desc:'声明 input 类型，同原生 input 标签的 type 属性，见：MDN(请直接使用 Input.TextArea 代替 type=\\'textarea\\')'},
    {label:'输入框内容',field:'value',type:'string',version:'',desc:'输入框内容'},
    {label:'输入框内容变化时的回调',field:'onChange',type:'function(e)',version:'',desc:'输入框内容变化时的回调'},
    {label:'按下回车的回调',field:'onPressEnter',type:'function(e)',version:'',desc:'按下回车的回调'}
]
* */
