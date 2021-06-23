export default {
    isContainer: true,
    fields: [
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '', desc: '是否有边框'},
        {label: '可浮起', category: '选项', field: 'hoverable', type: 'boolean', defaultValue: false, version: '', desc: '鼠标移过时可浮起'},
        {label: '加载中', category: '选项', field: 'loading', type: 'boolean', defaultValue: false, version: '', desc: '当卡片内容还在加载中时，可以用 loading 展示一个占位'},
        {
            label: '卡片标题', field: 'title', type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},

            ], version: '', desc: '卡片标题',
        },
        {label: '卡片封面', field: 'cover', type: 'ReactNode', version: '', desc: '卡片封面'},
        {label: '卡片右上角', field: 'extra', type: 'ReactNode', version: '', desc: '卡片右上角的操作区域'},
        {
            label: '大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'default', label: '默认'},
                {value: 'small', label: '小号'},
            ],
            defaultValue: 'default',
        },
    ],
};

/*
[
    {label:'卡片操作组，位置在卡片底部',field:'actions',type:'Array<ReactNode>',version:'',desc:'卡片操作组，位置在卡片底部'},
    {label:'当前激活页签的 key',field:'activeTabKey',type:'string',version:'',desc:'当前激活页签的 key'},
    {label:'内容区域自定义样式',field:'bodyStyle',type:'CSSProperties',version:'',desc:'内容区域自定义样式'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'',desc:'是否有边框'},
    {label:'卡片封面',field:'cover',type:'ReactNode',version:'',desc:'卡片封面'},
    {label:'初始化选中页签的 key，如果没有设置 activeTabKey',field:'defaultActiveTabKey',type:'string',defaultValue:'第一个页签',version:'',desc:'初始化选中页签的 key，如果没有设置 activeTabKey'},
    {label:'卡片右上角的操作区域',field:'extra',type:'ReactNode',version:'',desc:'卡片右上角的操作区域'},
    {label:'自定义标题区域样式',field:'headStyle',type:'CSSProperties',version:'',desc:'自定义标题区域样式'},
    {label:'鼠标移过时可浮起',field:'hoverable',type:'boolean',defaultValue:false,version:'',desc:'鼠标移过时可浮起'},
    {label:'当卡片内容还在加载中时，可以用 loading 展示一个占位',field:'loading',type:'boolean',defaultValue:false,version:'',desc:'当卡片内容还在加载中时，可以用 loading 展示一个占位'},
    {label:'card 的尺寸',field:'size',type:'radio-group',defaultValue:'default',version:'',options:[{value:'default',label:'default'},{value:'small',label:'small'}],desc:'card 的尺寸'},
    {label:'tab bar 上额外的元素',field:'tabBarExtraContent',type:'ReactNode',version:'',desc:'tab bar 上额外的元素'},
    {label:'页签标题列表',field:'tabList',type:'Array<{key: string, tab: ReactNode}>',version:'',desc:'页签标题列表'},
    {label:'Tabs',field:'tabProps',type:'-',version:'',desc:'Tabs'},
    {label:'卡片标题',field:'title',type:'ReactNode',version:'',desc:'卡片标题'},
    {label:'卡片类型，可设置为 inner 或 不设置',field:'type',type:'string',version:'',desc:'卡片类型，可设置为 inner 或 不设置'},
    {label:'页签切换的回调',field:'onTabChange',type:'(key) => void',version:'',desc:'页签切换的回调'}
]
* */
