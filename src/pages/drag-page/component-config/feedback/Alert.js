export default {
    isContainer: false,
    fields: [
        {
            label: '提示内容', field: 'message',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '警告提示内容',
        },
        {
            label: '辅助性介绍', field: 'description',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '警告提示的辅助性文字介绍',
        },
        {
            label: '提示样式', field: 'type', type: 'radio-group',
            options: [
                {value: 'success', label: '成功'},
                {value: 'info', label: '信息'},
                {value: 'warning', label: '警告'},
                {value: 'error', label: '失败'},
            ],
            defaultValue: 'info', version: '', desc: '指定警告提示的样式，有四种选择 success、info、warning、error',
        },
        {label: '显示图标', field: 'showIcon', type: 'boolean', defaultValue: false, version: '', desc: '是否显示辅助图标'},
        {label: '自定义图标', appendField: {showIcon: true}, field: 'icon', type: 'ReactNode', version: '', desc: '自定义图标，showIcon 为 true 时有效'},
        {label: '显示关闭按钮', field: 'closable', type: 'boolean', defaultValue: false, version: '', desc: '默认不显示关闭按钮'},
        {label: '自定义关闭按钮', appendField: {closable: true}, field: 'closeText', type: 'ReactNode', version: '', desc: '自定义关闭按钮'},
        {label: '自定义操作项', field: 'action', type: 'ReactNode', version: '4.9.0', desc: '自定义操作项'},
    ],
};

/*
[
    {label:'自定义操作项',field:'action',type:'ReactNode',version:'4.9.0',desc:'自定义操作项'},
    {label:'关闭动画结束后触发的回调函数',field:'afterClose',type:'() => void',version:'',desc:'关闭动画结束后触发的回调函数'},
    {label:'是否用作顶部公告',field:'banner',type:'boolean',defaultValue:false,version:'',desc:'是否用作顶部公告'},
    {label:'默认不显示关闭按钮',field:'closable',type:'boolean',version:'',desc:'默认不显示关闭按钮'},
    {label:'自定义关闭按钮',field:'closeText',type:'ReactNode',version:'',desc:'自定义关闭按钮'},
    {label:'警告提示的辅助性文字介绍',field:'description',type:'ReactNode',version:'',desc:'警告提示的辅助性文字介绍'},
    {label:'自定义图标，showIcon 为 true 时有效',field:'icon',type:'ReactNode',version:'',desc:'自定义图标，showIcon 为 true 时有效'},
    {label:'警告提示内容',field:'message',type:'ReactNode',version:'',desc:'警告提示内容'},
    {label:'是否显示辅助图标',field:'showIcon',type:'boolean',defaultValue:'false，banner 模式下默认值为 true',version:'',desc:'是否显示辅助图标'},
    {label:'指定警告提示的样式，有四种选择 success、info、warning、error',field:'type',type:'string',defaultValue:'info，banner 模式下默认值为 warning',version:'',desc:'指定警告提示的样式，有四种选择 success、info、warning、error'},
    {label:'关闭时触发的回调函数',field:'onClose',type:'(e: MouseEvent) => void',version:'',desc:'关闭时触发的回调函数'}
]
* */
