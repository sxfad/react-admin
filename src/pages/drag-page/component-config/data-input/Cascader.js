import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '可清除', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: true, version: '', desc: '是否支持清除'},
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '', desc: '是否有边框'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '禁用'},
        {label: '可搜索', category: '选项', field: 'showSearch', type: 'boolean', defaultValue: false, version: '', desc: '在选择框中显示搜索框'},
        {label: '输入框提示', field: 'placeholder', type: 'string', defaultValue: '请选择', version: '', desc: '输入框占位文本'},
        {
            label: '输入框大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '输入框大小',
        },
    ],
};

/*
[
    {label:'是否支持清除',field:'allowClear',type:'boolean',defaultValue:true,version:'',desc:'是否支持清除'},
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'',desc:'自动获取焦点'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'',desc:'是否有边框'},
    {label:'当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示',field:'changeOnSelect',type:'boolean',defaultValue:false,version:'',desc:'当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示'},
    {label:'自定义类名',field:'className',type:'string',version:'',desc:'自定义类名'},
    {label:'默认的选中项',field:'defaultValue',type:'enum',defaultValue:'[]',version:'',options:[{value:'string[]',label:'string[]'},{value:'number[]',label:'number[]'}],desc:'默认的选中项'},
    {label:'禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'禁用'},
    {label:'选择后展示的渲染函数',field:'displayRender',type:'(label, selectedOptions) => ReactNode',defaultValue:'label => label.join(/)',version:'',desc:'选择后展示的渲染函数'},
    {label:'自定义下拉框内容',field:'dropdownRender',type:'(menus: ReactNode) => ReactNode',version:'4.4.0',desc:'自定义下拉框内容'},
    {label:'自定义次级菜单展开图标',field:'expandIcon',type:'ReactNode',version:'4.4.0',desc:'自定义次级菜单展开图标'},
    {label:'次级菜单的展开方式，可选 'click' 和 'hover'',field:'expandTrigger',type:'string',defaultValue:'click',version:'',desc:'次级菜单的展开方式，可选 'click' 和 'hover''},
    {label:'自定义 options 中 label name children 的字段',field:'fieldNames',type:'object',defaultValue:'{ label: label, value: value, children: children }',version:'',desc:'自定义 options 中 label name children 的字段'},
    {label:'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例',field:'getPopupContainer',type:'function(triggerNode)',defaultValue:'() => document.body',version:'',desc:'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。示例'},
    {label:'用于动态加载选项，无法与 showSearch 一起使用',field:'loadData',type:'(selectedOptions) => void',version:'',desc:'用于动态加载选项，无法与 showSearch 一起使用'},
    {label:'当下拉列表为空时显示的内容',field:'notFoundContent',type:'string',defaultValue:'Not Found',version:'',desc:'当下拉列表为空时显示的内容'},
    {label:'可选项数据源',field:'options',type:'Option[]',version:'',desc:'可选项数据源'},
    {label:'输入框占位文本',field:'placeholder',type:'string',defaultValue:'请选择',version:'',desc:'输入框占位文本'},
    {label:'自定义浮层类名',field:'popupClassName',type:'string',version:'',desc:'自定义浮层类名'},
    {label:'浮层预设位置：bottomLeft bottomRight topLeft topRight',field:'popupPlacement',type:'string',defaultValue:'bottomLeft',version:'',desc:'浮层预设位置：bottomLeft bottomRight topLeft topRight'},
    {label:'控制浮层显隐',field:'popupVisible',type:'boolean',version:'',desc:'控制浮层显隐'},
    {label:'在选择框中显示搜索框',field:'showSearch',type:'enum',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'Object',label:'Object'}],desc:'在选择框中显示搜索框'},
    {label:'输入框大小',field:'size',type:'enum',version:'',options:[{value:'large',label:'large'},{value:'middle',label:'middle'},{value:'small',label:'small'}],desc:'输入框大小'},
    {label:'自定义样式',field:'style',type:'CSSProperties',version:'',desc:'自定义样式'},
    {label:'自定义的选择框后缀图标',field:'suffixIcon',type:'ReactNode',version:'',desc:'自定义的选择框后缀图标'},
    {label:'指定选中项',field:'value',type:'enum',version:'',options:[{value:'string[]',label:'string[]'},{value:'number[]',label:'number[]'}],desc:'指定选中项'},
    {label:'选择完成后的回调',field:'onChange',type:'(value, selectedOptions) => void',version:'',desc:'选择完成后的回调'},
    {label:'显示/隐藏浮层的回调',field:'onPopupVisibleChange',type:'(value) => void',version:'',desc:'显示/隐藏浮层的回调'}
]
* */
