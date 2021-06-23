export default {
    isContainer: true,
    dropAccept: ['Menu.Item', 'Menu.SubMenu', 'Menu.ItemGroup'],
    fields: [
        {
            label: '菜单类型',
            field: 'mode',
            type: 'radio-group',
            defaultValue: 'vertical',
            version: '',
            options: [
                {value: 'vertical', label: '垂直'},
                {value: 'horizontal', label: '水平'},
                {value: 'inline', label: '内嵌'},
            ],
            desc: '菜单类型，现在支持垂直、水平、和内嵌模式三种',
        },
        {label: '是否允许选中', field: 'selectable', type: 'boolean', defaultValue: true, version: '', desc: '是否允许选中'},
        {label: '是否允许多选', appendField: {selectable: true}, field: 'multiple', type: 'boolean', defaultValue: false, version: '', desc: '是否允许多选'},
        {
            label: '主题颜色', field: 'theme', type: 'radio-group', defaultValue: 'light', version: '',
            options: [
                {value: 'light', label: '亮色'},
                {value: 'dark', label: '暗色'},
            ],
            desc: '主题颜色',
        },
    ],
};

/*
[
    {label:'初始展开的 SubMenu 菜单项 key 数组',field:'defaultOpenKeys',type:'string[]',version:'',desc:'初始展开的 SubMenu 菜单项 key 数组'},
    {label:'初始选中的菜单项 key 数组',field:'defaultSelectedKeys',type:'string[]',version:'',desc:'初始选中的菜单项 key 数组'},
    {label:'自定义展开图标',field:'expandIcon',type:'radio-group',version:'4.9.0',options:[{value:'ReactNode',label:'ReactNode'},{value:'(props: SubMenuProps & { isSubMenu: boolean }) => ReactNode',label:'(props: SubMenuProps & { isSubMenu: boolean }) => ReactNode'}],desc:'自定义展开图标'},
    {label:'在子菜单展示之前就渲染进 DOM',field:'forceSubMenuRender',type:'boolean',defaultValue:false,version:'',desc:'在子菜单展示之前就渲染进 DOM'},
    {label:'inline 时菜单是否收起状态',field:'inlineCollapsed',type:'boolean',version:'',desc:'inline 时菜单是否收起状态'},
    {label:'inline 模式的菜单缩进宽度',field:'inlineIndent',type:'number',defaultValue:'24',version:'',desc:'inline 模式的菜单缩进宽度'},
    {label:'菜单类型，现在支持垂直、水平、和内嵌模式三种',field:'mode',type:'radio-group',defaultValue:'vertical',version:'',options:[{value:'vertical',label:'vertical'},{value:'horizontal',label:'horizontal'},{value:'inline',label:'inline'}],desc:'菜单类型，现在支持垂直、水平、和内嵌模式三种'},
    {label:'是否允许多选',field:'multiple',type:'boolean',defaultValue:false,version:'',desc:'是否允许多选'},
    {label:'当前展开的 SubMenu 菜单项 key 数组',field:'openKeys',type:'string[]',version:'',desc:'当前展开的 SubMenu 菜单项 key 数组'},
    {label:'自定义 Menu 折叠时的图标',field:'overflowedIndicator',type:'ReactNode',version:'',desc:'自定义 Menu 折叠时的图标'},
    {label:'是否允许选中',field:'selectable',type:'boolean',defaultValue:true,version:'',desc:'是否允许选中'},
    {label:'当前选中的菜单项 key 数组',field:'selectedKeys',type:'string[]',version:'',desc:'当前选中的菜单项 key 数组'},
    {label:'根节点样式',field:'style',type:'CSSProperties',version:'',desc:'根节点样式'},
    {label:'用户鼠标离开子菜单后关闭延时，单位：秒',field:'subMenuCloseDelay',type:'number',defaultValue:'0.1',version:'',desc:'用户鼠标离开子菜单后关闭延时，单位：秒'},
    {label:'用户鼠标进入子菜单后开启延时，单位：秒',field:'subMenuOpenDelay',type:'number',defaultValue:'0',version:'',desc:'用户鼠标进入子菜单后开启延时，单位：秒'},
    {label:'主题颜色',field:'theme',type:'radio-group',defaultValue:'light',version:'',options:[{value:'light',label:'light'},{value:'dark',label:'dark'}],desc:'主题颜色'},
    {label:'SubMenu 展开/关闭的触发行为',field:'triggerSubMenuAction',type:'radio-group',defaultValue:'hover',version:'',options:[{value:'hover',label:'hover'},{value:'click',label:'click'}],desc:'SubMenu 展开/关闭的触发行为'},
    {label:'点击 MenuItem 调用此函数',field:'onClick',type:'function({ item, key, keyPath, domEvent })',version:'',desc:'点击 MenuItem 调用此函数'},
    {label:'取消选中时调用，仅在 multiple 生效',field:'onDeselect',type:'function({ item, key, keyPath, selectedKeys, domEvent })',version:'',desc:'取消选中时调用，仅在 multiple 生效'},
    {label:'SubMenu 展开/关闭的回调',field:'onOpenChange',type:'function(openKeys: string[])',version:'',desc:'SubMenu 展开/关闭的回调'},
    {label:'被选中时调用',field:'onSelect',type:'function({ item, key, keyPath, selectedKeys, domEvent })',defaultValue:'-  ',version:'',desc:'被选中时调用'}
]
* */
