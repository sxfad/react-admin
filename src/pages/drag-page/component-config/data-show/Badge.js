export default {
    draggable: true,
    isContainer: true,
    hooks: {
        // afterPropsChange: options => {
        //     const {node, dragPageAction} = options;
        //
        //     if (!node.props.dot) {
        //         Reflect.deleteProperty(node.props, 'color');
        //         dragPageAction.render(true);
        //     }
        // },
    },
    fields: [
        {label: '只展示小红点', category: '选项', field: 'dot', type: 'boolean', defaultValue: false, version: '', desc: '不展示数字，只有一个小红点'},
        {label: '0是否展示', category: '选项', field: 'showZero', type: 'boolean', defaultValue: false, version: '', desc: '当数值为 0 时，是否展示 Badge'},
        {label: '圆点颜色', appendField: {dot: true}, field: 'color', type: 'color', version: '', desc: '自定义小圆点的颜色'},
        // eslint-disable-next-line
        {label: '展示的数字', appendField: {dot: [false, '', undefined]}, field: 'count', type: 'number', version: '', desc: '展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏'},
        {label: '封顶数值', appendField: {dot: [false, '', undefined]}, field: 'overflowCount', type: 'number', defaultValue: 99, version: '', desc: '展示封顶的数字值'},
        {
            label: '圆点的大小', appendField: {dot: [false, '', undefined]}, field: 'size', type: 'radio-group', version: '4.6.0',
            options: [
                {value: 'default', label: '默认'},
                {value: 'small', label: '小号'},
            ],
            desc: '在设置了 count 的前提下有效，设置小圆点的大小',
        },
        {label: '位置偏移', field: 'offset', type: 'offset', defaultValue: [0, 0], version: '', desc: '设置状态点的位置偏移'},
        // {
        //     label: '设置为状态点',
        //     field: 'status',
        //     type: 'radio-group',
        //     version: '',
        //     options: [
        //         {value: 'default', label: '默认'},
        //         {value: 'success', label: '成功'},
        //         {value: 'error', label: '失败'},
        //         {value: 'warning', label: '警告'},
        //         {value: 'processing', label: '进行中'},
        //     ],
        //     desc: '设置 Badge 为状态点',
        // },
        // {label: '状态文本', appendField: 'status', field: 'text', type: 'string', version: '', desc: '在设置了 status 的前提下有效，设置状态点的文本'},
        // {label: '鼠标悬停文字', field: 'title', type: 'string', version: '', desc: '设置鼠标放在状态点上时显示的文字'},
    ],
};

/*
[
    {label:'自定义小圆点的颜色',field:'color',type:'string',version:'',desc:'自定义小圆点的颜色'},
    {label:'展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏',field:'count',type:'ReactNode',version:'',desc:'展示的数字，大于 overflowCount 时显示为 ${overflowCount}+，为 0 时隐藏'},
    {label:'不展示数字，只有一个小红点',field:'dot',type:'boolean',defaultValue:false,version:'',desc:'不展示数字，只有一个小红点'},
    {label:'设置状态点的位置偏移',field:'offset',type:'[number, number]',version:'',desc:'设置状态点的位置偏移'},
    {label:'展示封顶的数字值',field:'overflowCount',type:'number',defaultValue:'99',version:'',desc:'展示封顶的数字值'},
    {label:'当数值为 0 时，是否展示 Badge',field:'showZero',type:'boolean',defaultValue:false,version:'',desc:'当数值为 0 时，是否展示 Badge'},
    {label:'在设置了 count 的前提下有效，设置小圆点的大小',field:'size',type:'radio-group',version:'4.6.0',options:[{value:'default',label:'default'},{value:'small',label:'small'}],desc:'在设置了 count 的前提下有效，设置小圆点的大小'},
    {label:'设置 Badge 为状态点',field:'status',type:'radio-group',version:'',options:[{value:'success',label:'success'},{value:'processing',label:'processing'},{value:'default',label:'default'},{value:'error',label:'error'},{value:'warning',label:'warning'}],desc:'设置 Badge 为状态点'},
    {label:'在设置了 status 的前提下有效，设置状态点的文本',field:'text',type:'ReactNode',version:'',desc:'在设置了 status 的前提下有效，设置状态点的文本'},
    {label:'设置鼠标放在状态点上时显示的文字',field:'title',type:'string',version:'',desc:'设置鼠标放在状态点上时显示的文字'}
]
* */
