export default {
    isContainer: true,
    dropAccept: ['Steps.Step'],
    fields: [
        {label: '当前步骤', field: 'current', type: 'number', defaultValue: 0, version: '', desc: '指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态'},
        {
            label: '步骤条方向', field: 'direction', type: 'radio-group',
            options: [
                {value: 'horizontal', label: '水平'},
                {value: 'vertical', label: '竖直'},
            ],
            defaultValue: 'horizontal',
            version: '', desc: '指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向',
        },
        {label: '起始序号', field: 'initial', type: 'number', defaultValue: 0, version: '', desc: '起始序号，从 0 开始记数'},
        {
            label: '标签位置', field: 'labelPlacement', type: 'radio-group',
            options: [
                {value: 'horizontal', label: '图标右侧'},
                {value: 'vertical', label: '图标下方'},
            ], defaultValue: 'horizontal', version: '',
            desc: '指定标签放置位置，默认水平放图标右侧，可选 vertical 放图标下方',
        },
        {label: '进度条进度', field: 'percent', type: 'number', version: '4.5.0', desc: '当前 process 步骤显示的进度条进度（只对基本类型的 Steps 生效）'},
        {
            label: '点状步骤条',
            field: 'progressDot',
            type: 'boolean',
            defaultValue: false,
            version: '',
            desc: '点状步骤条，可以设置为一个 function，labelPlacement 将强制为 vertical',
        },
        {
            label: '大小', field: 'size', type: 'radio-group',
            options: [
                {value: 'default', label: '默认'},
                {value: 'small', label: '小号'},
            ],
            defaultValue: 'default', version: '', desc: '指定大小，目前支持普通（default）和迷你（small）',
        },
        {
            label: '当前步骤状态', field: 'status',
            type: 'radio-group',
            options: [
                {value: 'wait', label: '等待'},
                {value: 'process', label: '进行中'},
                {value: 'finish', label: '完成'},
                {value: 'error', label: '报错'},
            ],
            defaultValue: 'process', version: '', desc: '指定当前步骤的状态，可选 wait process finish error',
        },
    ],
};

/*
[
    {label:'步骤条类名',field:'className',type:'string',version:'',desc:'步骤条类名'},
    {label:'指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态',field:'current',type:'number',defaultValue:'0',version:'',desc:'指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态'},
    {label:'指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向',field:'direction',type:'string',defaultValue:'horizontal',version:'',desc:'指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向'},
    {label:'起始序号，从 0 开始记数',field:'initial',type:'number',defaultValue:'0',version:'',desc:'起始序号，从 0 开始记数'},
    {label:'指定标签放置位置，默认水平放图标右侧，可选 vertical 放图标下方',field:'labelPlacement',type:'string',defaultValue:'horizontal',version:'',desc:'指定标签放置位置，默认水平放图标右侧，可选 vertical 放图标下方'},
    {label:'当前 process 步骤显示的进度条进度（只对基本类型的 Steps 生效）',field:'percent',type:'number',version:'4.5.0',desc:'当前 process 步骤显示的进度条进度（只对基本类型的 Steps 生效）'},
    {label:'点状步骤条，可以设置为一个 function，labelPlacement 将强制为 vertical',field:'progressDot',type:'radio-group',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'(iconDot, {index, status, title, description}) => ReactNode',label:'(iconDot, {index, status, title, description}) => ReactNode'}],desc:'点状步骤条，可以设置为一个 function，labelPlacement 将强制为 vertical'},
    {label:'当屏幕宽度小于 532px 时自动变为垂直模式',field:'responsive',type:'boolean',version:'true',desc:'当屏幕宽度小于 532px 时自动变为垂直模式'},
    {label:'指定大小，目前支持普通（default）和迷你（small）',field:'size',type:'string',defaultValue:'default',version:'',desc:'指定大小，目前支持普通（default）和迷你（small）'},
    {label:'指定当前步骤的状态，可选 wait process finish error',field:'status',type:'string',defaultValue:'process',version:'',desc:'指定当前步骤的状态，可选 wait process finish error'},
    {label:'步骤条类型，有 default 和 navigation 两种',field:'type',type:'string',defaultValue:'default',version:'',desc:'步骤条类型，有 default 和 navigation 两种'},
    {label:'点击切换步骤时触发',field:'onChange',type:'(current) => void',version:'',desc:'点击切换步骤时触发'}
]
* */
