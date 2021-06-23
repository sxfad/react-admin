export default {
    isContainer: true,
    fields: [
        {label: '可关闭', category: '选项', field: 'closable', type: 'boolean', defaultValue: false, version: '', desc: '标签是否可以关闭'},
        {label: '是否显示', category: '选项', field: 'visible', type: 'boolean', defaultValue: true, version: '', desc: '是否显示标签'},
        {label: '标签色', field: 'color', type: 'color', version: '', desc: '标签色'},
        {label: '设置图标', field: 'icon', type: 'icon', version: '', desc: '设置图标'},
        /*
        [
    {label:'标签是否可以关闭',field:'closable',type:'boolean',defaultValue:false,version:'',desc:'标签是否可以关闭'},
    {label:'自定义关闭按钮',field:'closeIcon',type:'ReactNode',version:'4.4.0',desc:'自定义关闭按钮'},
    {label:'标签色',field:'color',type:'string',version:'',desc:'标签色'},
    {label:'设置图标',field:'icon',type:'ReactNode',version:'',desc:'设置图标'},
    {label:'是否显示标签',field:'visible',type:'boolean',defaultValue:true,version:'',desc:'是否显示标签'},
    {label:'关闭时的回调',field:'onClose',type:'(e) => void',version:'',desc:'关闭时的回调'}
]
        * */
    ],
};
