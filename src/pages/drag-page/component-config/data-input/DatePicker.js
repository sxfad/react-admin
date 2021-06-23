import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '可清除', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: true, version: '', desc: '是否显示清除按钮'},
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '', desc: '是否有边框'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '禁用'},
        {
            label: '时间类型',
            field: 'picker',
            type: 'radio-group',
            defaultValue: 'date',
            version: 'quarter: 4.1.0',
            options: [
                {value: 'date', label: '日期'},
                {value: 'week', label: '周'},
                {value: 'month', label: '月份'},
                {value: 'quarter', label: '季度'},
                {value: 'year', label: '年'},
            ],
            desc: '设置选择器类型',
        },
        {
            label: '输入框提示', field: 'placeholder', type: 'string',
            version: '',
            desc: '输入框提示文字',
        },

        {
            label: '输入框大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '输入框大小，large 高度为 40px，small 为 24px，默认是 32px',
        },
        {label: '日期格式', field: 'format', type: 'string', version: '', desc: '展示的日期格式'},
    ],
};
/*
DatePicker[picker=year] quarter month week
[
    {label:'默认面板日期',field:'defaultPickerValue',type:'moment',version:'',desc:'默认面板日期'},
    {label:'默认日期',field:'defaultValue',type:'moment',version:'',desc:'默认日期'},
    {label:'展示的日期格式，配置参考 moment.js',field:'format',type:'string',defaultValue:'YYYY',version:'',desc:'展示的日期格式，配置参考 moment.js'},
    {label:'在面板中添加额外的页脚',field:'renderExtraFooter',type:'() => React.ReactNode',version:'',desc:'在面板中添加额外的页脚'},
    {label:'日期',field:'value',type:'moment',version:'',desc:'日期'},
    {label:'时间发生变化的回调，发生在用户选择时间时',field:'onChange',type:'function(date: moment, dateString: string)',version:'',desc:'时间发生变化的回调，发生在用户选择时间时'}
]
* */
/*
[
    {label:'是否显示清除按钮',field:'allowClear',type:'boolean',defaultValue:true,version:'',desc:'是否显示清除按钮'},
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'',desc:'自动获取焦点'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'',desc:'是否有边框'},
    {label:'选择器 className',field:'className',type:'string',version:'',desc:'选择器 className'},
    {label:'自定义日期单元格的内容',field:'dateRender',type:'function(currentDate: moment, today: moment) => React.ReactNode',version:'',desc:'自定义日期单元格的内容'},
    {label:'禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'禁用'},
    {label:'不可选择的日期',field:'disabledDate',type:'(currentDate: moment) => boolean',version:'',desc:'不可选择的日期'},
    {label:'额外的弹出日历 className',field:'dropdownClassName',type:'string',version:'',desc:'额外的弹出日历 className'},
    {label:'定义浮层的容器，默认为 body 上新建 div',field:'getPopupContainer',type:'function(trigger)',version:'',desc:'定义浮层的容器，默认为 body 上新建 div'},
    {label:'设置输入框为只读（避免在移动设备上打开虚拟键盘）',field:'inputReadOnly',type:'boolean',defaultValue:false,version:'',desc:'设置输入框为只读（避免在移动设备上打开虚拟键盘）'},
    {label:'国际化配置',field:'locale',type:'object',defaultValue:'默认配置',version:'',desc:'国际化配置'},
    {label:'日期面板的状态（设置后无法选择年份/月份？）',field:'mode',type:'enum',version:'',options:[{value:'time',label:'time'},{value:'date',label:'date'},{value:'month',label:'month'},{value:'year',label:'year'},{value:'decade',label:'decade'}],desc:'日期面板的状态（设置后无法选择年份/月份？）'},
    {label:'控制弹层是否展开',field:'open',type:'boolean',version:'',desc:'控制弹层是否展开'},
    {label:'自定义渲染面板',field:'panelRender',type:'(panelNode) => ReactNode',version:'4.5.0',desc:'自定义渲染面板'},
    {label:'设置选择器类型',field:'picker',type:'enum',defaultValue:'date',version:'quarter: 4.1.0',options:[{value:'date',label:'date'},{value:'week',label:'week'},{value:'month',label:'month'},{value:'quarter',label:'quarter'},{value:'year',label:'year'}],desc:'设置选择器类型'},
    {label:'输入框提示文字',field:'placeholder',type:'enum',version:'',options:[{value:'string',label:'string'},{value:'[string, string]',label:'[string, string]'}],desc:'输入框提示文字'},
    {label:'额外的弹出日历样式',field:'popupStyle',type:'CSSProperties',defaultValue:'{}',version:'',desc:'额外的弹出日历样式'},
    {label:'输入框大小，large 高度为 40px，small 为 24px，默认是 32px',field:'size',type:'enum',version:'',options:[{value:'large',label:'large'},{value:'middle',label:'middle'},{value:'small',label:'small'}],desc:'输入框大小，large 高度为 40px，small 为 24px，默认是 32px'},
    {label:'自定义输入框样式',field:'style',type:'CSSProperties',defaultValue:'{}',version:'',desc:'自定义输入框样式'},
    {label:'自定义的选择框后缀图标',field:'suffixIcon',type:'ReactNode',version:'',desc:'自定义的选择框后缀图标'},
    {label:'弹出日历和关闭日历的回调',field:'onOpenChange',type:'function(open)',version:'',desc:'弹出日历和关闭日历的回调'},
    {label:'日历面板切换的回调',field:'onPanelChange',type:'function(value, mode)',version:'',desc:'日历面板切换的回调'}
]
* */
