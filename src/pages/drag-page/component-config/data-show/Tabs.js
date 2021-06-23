export default {
    isContainer: true,
    dropAccept: ['Tabs.TabPane'],
    editableContents: [
        {
            selector: '.ant-tabs-tab .ant-tabs-tab-btn',
            propsField: 'tab', // 可以直接定位到直接子节点
        },
    ],
    fields: [
        {
            label: '页签样式', field: 'type', type: 'radio-group',
            options: [
                {value: 'line', label: '线条'},
                {value: 'card', label: '卡片'},
                {value: 'editable-card', label: '可编辑卡片'},
            ],
            defaultValue: 'line', version: '', desc: '页签的基本样式，可选 line、card editable-card 类型',
        },
        {
            label: '卡片动画',
            category: '选项',
            appendField: {tabPosition: 'top'},
            field: ['animated', 'inkBar'],
            type: 'boolean',
            defaultValue: true,
            // defaultValue: '{ inkBar: true, tabPane: false }',
            version: '',
            options: [{value: 'boolean', label: 'boolean'}, {value: '{ inkBar: boolean, tabPane: boolean }', label: '{ inkBar: boolean, tabPane: boolean }'}],
            desc: '是否使用动画切换 Tabs, 仅生效于 tabPosition=\'top\'',
        },
        {
            label: '页面动画',
            category: '选项',
            appendField: {tabPosition: 'top'},
            field: ['animated', 'tabPane'],
            type: 'boolean',
            defaultValue: false,
            version: '',
            options: [{value: 'boolean', label: 'boolean'}, {value: '{ inkBar: boolean, tabPane: boolean }', label: '{ inkBar: boolean, tabPane: boolean }'}],
            desc: '是否使用动画切换 Tabs, 仅生效于 tabPosition=\'top\'',
        },
        {label: '标签居中展示', category: '选项', field: 'centered', type: 'boolean', defaultValue: false, version: '4.4.0', desc: '标签居中展示'},
        {label: '键盘切换', category: '选项', field: 'keyboard', type: 'boolean', defaultValue: true, version: '', desc: '开启键盘切换功能'},
        {
            label: '大小', field: 'size', type: 'radio-group',
            options: [
                // large default 和 small
                {value: 'default', label: '默认'},
                {value: 'large', label: '大号'},
                {value: 'small', label: '小号'},
            ],
            defaultValue: 'default', version: '', desc: '大小，提供 large default 和 small 三种大小',
        },
        {
            label: '页签位置', field: 'tabPosition', type: 'radio-group',
            options: [
                //，可选值有 top right bottom left
                {value: 'top', label: '顶部'},
                {value: 'right', label: '右侧'},
                {value: 'bottom', label: '底部'},
                {value: 'left', label: '左侧'},
            ],
            defaultValue: 'top', version: '', desc: '页签位置，可选值有 top right bottom left',
        },

        // {label: '当前激活 tab 面板的 key', field: 'activeKey', type: 'string', version: '', desc: '当前激活 tab 面板的 key'},
        // {label: '自定义添加按钮', field: 'addIcon', type: 'ReactNode', version: '4.4.0', desc: '自定义添加按钮'},
        // {label:'是否使用动画切换 Tabs, 仅生效于 tabPosition=\\'top\\'',field:'animated',type:'enum',defaultValue:'{ inkBar: true, tabPane: false }',version:'',options:[{value:'boolean',label:'boolean'},{value:'{ inkBar: boolean, tabPane: boolean }',label:'{ inkBar: boolean, tabPane: boolean }'}],desc:'是否使用动画切换 Tabs, 仅生效于 tabPosition=\\'top\\''},
        // {label:'标签居中展示',field:'centered',type:'boolean',defaultValue:false,version:'4.4.0',desc:'标签居中展示'},
        // {label:'初始化选中面板的 key，如果没有设置 activeKey',field:'defaultActiveKey',type:'string',defaultValue:'第一个面板',version:'',desc:'初始化选中面板的 key，如果没有设置 activeKey'},
        // {label:'是否隐藏加号图标，在 type=\\'editable-card\\' 时有效',field:'hideAdd',type:'boolean',defaultValue:false,version:'',desc:'是否隐藏加号图标，在 type=\\'editable-card\\' 时有效'},
        // {label:'开启键盘切换功能',field:'keyboard',type:'boolean',defaultValue:true,version:'',desc:'开启键盘切换功能'},
        // {label:'替换 TabBar，用于二次封装标签头',field:'renderTabBar',type:'(props: DefaultTabBarProps, DefaultTabBar: React.ComponentClass) => React.ReactElement',version:'',desc:'替换 TabBar，用于二次封装标签头'},
        // {label:'大小，提供 large default 和 small 三种大小',field:'size',type:'string',defaultValue:'default',version:'',desc:'大小，提供 large default 和 small 三种大小'},
        // {label:'tab bar 上额外的元素',field:'tabBarExtraContent',type:'enum',version:'object: 4.6.0',options:[{value:'ReactNode',label:'ReactNode'},{value:'{left?: ReactNode, right?: ReactNode}',label:'{left?: ReactNode, right?: ReactNode}'}],desc:'tab bar 上额外的元素'},
        // {label:'tabs 之间的间隙',field:'tabBarGutter',type:'number',version:'',desc:'tabs 之间的间隙'},
        // {label:'tab bar 的样式对象',field:'tabBarStyle',type:'object',version:'',desc:'tab bar 的样式对象'},
        // {label:'页签位置，可选值有 top right bottom left',field:'tabPosition',type:'string',defaultValue:'top',version:'',desc:'页签位置，可选值有 top right bottom left'},
        // {label:'切换面板的回调',field:'onChange',type:'function(activeKey) {}',version:'',desc:'切换面板的回调'},
        // {label:'新增和删除页签的回调，在 type=\\'editable-card\\' 时有效',field:'onEdit',type:'(targetKey, action): void',version:'',desc:'新增和删除页签的回调，在 type=\\'editable-card\\' 时有效'},
        // {label:'tab 被点击的回调',field:'onTabClick',type:'function(key: string, event: MouseEvent)',version:'',desc:'tab 被点击的回调'},
        // {label:'tab 滚动时触发',field:'onTabScroll',type:'enum',version:'4.3.0',options:[{value:'function({ direction: left',label:'function({ direction: left'},{value:'right',label:'right'},{value:'top',label:'top'},{value:'bottom })',label:'bottom })'}],desc:'tab 滚动时触发'}
    ],
};
