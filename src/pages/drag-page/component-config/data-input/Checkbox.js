export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        {label: '是否选中', category: '选项', field: 'checked', type: 'boolean', defaultValue: false, version: '', desc: '指定当前是否选中'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '失效状态'},
    ],
};

/*
[
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'',desc:'自动获取焦点'},
    {label:'指定当前是否选中',field:'checked',type:'boolean',defaultValue:false,version:'',desc:'指定当前是否选中'},
    {label:'初始是否选中',field:'defaultChecked',type:'boolean',defaultValue:false,version:'',desc:'初始是否选中'},
    {label:'失效状态',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'失效状态'},
    {label:'设置 indeterminate 状态，只负责样式控制',field:'indeterminate',type:'boolean',defaultValue:false,version:'',desc:'设置 indeterminate 状态，只负责样式控制'},
    {label:'变化时回调函数',field:'onChange',type:'function(e:Event)',version:'',desc:'变化时回调函数'}
]
* */
