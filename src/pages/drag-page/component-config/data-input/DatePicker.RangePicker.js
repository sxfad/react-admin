import DatePicker from './DatePicker';

export default {
    isFormElement: true,
    isContainer: false,
    fields: [
        ...(DatePicker.fields.filter(item => item.field !== 'placeholder')),
        {
            label: '输入框提示', field: 'placeholder',
            type: {value: 'array', label: '分别设置', length: 2, type: 'string'},
            version: '',
            desc: '输入框提示文字',
        },
        {label: '允许为空', field: 'allowEmpty', type: {value: 'array', type: 'boolean', length: 2}, defaultValue: [false, false], version: '', desc: '允许起始项部分为空'},
        {label: '禁用', field: 'disabled', type: {value: 'array', type: 'boolean', length: 2}, version: '', desc: '禁用起始项'},
        {label: '显示时间', field: 'showTime', type: 'boolean', version: '', desc: '增加时间选择功能'},
    ],
};
/*

[
    {label:'允许起始项部分为空',field:'allowEmpty',type:'[boolean, boolean]',defaultValue:'[false, false]',version:'',desc:'允许起始项部分为空'},
    {label:'自定义日期单元格的内容。info 参数自 4.3.0 添加',field:'dateRender',type:'enum',version:'',options:[{value:'function(currentDate: moment, today: moment, info: { range: start',label:'function(currentDate: moment, today: moment, info: { range: start'},{value:'end }) => React.ReactNode',label:'end }) => React.ReactNode'}],desc:'自定义日期单元格的内容。info 参数自 4.3.0 添加'},
    {label:'默认面板日期',field:'defaultPickerValue',type:'moment[]',version:'',desc:'默认面板日期'},
    {label:'默认日期',field:'defaultValue',type:'moment[]',version:'',desc:'默认日期'},
    {label:'禁用起始项',field:'disabled',type:'[boolean, boolean]',version:'',desc:'禁用起始项'},
    {label:'不可选择的时间',field:'disabledTime',type:'enum',version:'',options:[{value:'function(date: moment, partial: start',label:'function(date: moment, partial: start'},{value:'end)',label:'end)'}],desc:'不可选择的时间'},
    {label:'展示的日期格式',field:'format',type:'string',defaultValue:'YYYY-MM-DD HH:mm:ss',version:'',desc:'展示的日期格式'},
    {label:'预设时间范围快捷选择',field:'ranges',type:'enum',version:'',options:[{value:'{ [range: string]: moment[] }',label:'{ [range: string]: moment[] }'},{value:'{ [range: string]: () => moment[] }',label:'{ [range: string]: () => moment[] }'}],desc:'预设时间范围快捷选择'},
    {label:'在面板中添加额外的页脚',field:'renderExtraFooter',type:'() => React.ReactNode',version:'',desc:'在面板中添加额外的页脚'},
    {label:'设置分隔符',field:'separator',type:'string',defaultValue:'~',version:'',desc:'设置分隔符'},
    {label:'增加时间选择功能',field:'showTime',type:'Object|boolean',defaultValue:'TimePicker Options',version:'',desc:'增加时间选择功能'},
    {label:'设置用户选择日期时默认的时分秒，例子',field:'showTime.defaultValue',type:'moment[]',defaultValue:'[moment(), moment()]',version:'',desc:'设置用户选择日期时默认的时分秒，例子'},
    {label:'日期',field:'value',type:'moment[]',version:'',desc:'日期'},
    {label:'待选日期发生变化的回调。info 参数自 4.4.0 添加',field:'onCalendarChange',type:'function(dates: [moment, moment], dateStrings: [string, string], info: { range:start|end })',version:'',desc:'待选日期发生变化的回调。info 参数自 4.4.0 添加'},
    {label:'日期范围发生变化的回调',field:'onChange',type:'function(dates: [moment, moment], dateStrings: [string, string])',version:'',desc:'日期范围发生变化的回调'}
]
* */
