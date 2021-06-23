export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        {label: '禁用', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '失效状态'},
        {label: '可选项', field: 'options', type: 'options', version: '', desc: '指定可选项'},
    ],
};

/*
[
    {label:'默认选中的选项',field:'defaultValue',type:'string[]',defaultValue:'[]',version:'',desc:'默认选中的选项'},
    {label:'整组失效',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'整组失效'},
    {label:'CheckboxGroup 下所有 input[type=\\'checkbox\\'] 的 name 属性',field:'name',type:'string',version:'',desc:'CheckboxGroup 下所有 input[type=\\'checkbox\\'] 的 name 属性'},
    {label:'指定可选项',field:'options',type:'enum',defaultValue:'[]',version:'',options:[{value:'string[]',label:'string[]'},{value:'Option[]',label:'Option[]'}],desc:'指定可选项'},
    {label:'指定选中的选项',field:'value',type:'string[]',defaultValue:'[]',version:'',desc:'指定选中的选项'},
    {label:'变化时回调函数',field:'onChange',type:'function(checkedValue)',version:'',desc:'变化时回调函数'}
]
* */
