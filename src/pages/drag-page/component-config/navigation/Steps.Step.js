export default {
    isContainer: false,
    dropInTo: ['Steps'],
    editableContents: [
        {
            selector: '.ant-steps-item-title',
            propsField: 'title',
        },
        // { // 与title父子级关系，冲突
        //     selector: '.ant-steps-item-subtitle',
        //     propsField: 'subTitle',
        // },
        {
            selector: '.ant-steps-item-description',
            propsField: 'description',
        },
    ],
    fields: [
        {
            label: '标题', field: 'title',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '标题',
        },
        {
            label: '子标题', field: 'subTitle',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '子标题',
        },
        {
            label: '状态', field: 'status',
            type: 'radio-group',
            options: [
                {value: 'wait', label: '等待'},
                {value: 'process', label: '进行中'},
                {value: 'finish', label: '完成'},
                {value: 'error', label: '报错'},
            ],
            defaultValue: 'wait', version: '', desc: '指定状态。当不配置该属性时，会使用 Steps 的 current 来自动指定状态。可选：wait process finish error',
        },
        {
            label: '详情描述', field: 'description',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '步骤的详情描述，可选',
        },
        {label: '禁用点击', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '禁用点击'},
        {label: '步骤图标', field: 'icon', type: 'ReactNode', version: '', desc: '步骤图标的类型，可选'},
    ],
};

/*
[
    {label:'步骤的详情描述，可选',field:'description',type:'ReactNode',version:'',desc:'步骤的详情描述，可选'},
    {label:'禁用点击',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'禁用点击'},
    {label:'步骤图标的类型，可选',field:'icon',type:'ReactNode',version:'',desc:'步骤图标的类型，可选'},
    {label:'指定状态。当不配置该属性时，会使用 Steps 的 current 来自动指定状态。可选：wait process finish error',field:'status',type:'string',defaultValue:'wait',version:'',desc:'指定状态。当不配置该属性时，会使用 Steps 的 current 来自动指定状态。可选：wait process finish error'},
    {label:'子标题',field:'subTitle',type:'ReactNode',version:'',desc:'子标题'},
    {label:'标题',field:'title',type:'ReactNode',version:'',desc:'标题'}
]
* */
