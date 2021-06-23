import {fixDragProps} from 'src/pages/drag-page/util';
import timePickerConfig from './TimePicker';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        ...timePickerConfig.fields.filter(item => item.field !== 'placeholder'),
        {label: '输入框提示', field: 'placeholder', type: 'string', defaultValue: '请选择时间', version: '', desc: '没有值的时候显示的内容'},
        {label: '自动排序', field: 'order', type: 'boolean', defaultValue: true, version: '4.1.0', desc: '始末时间是否自动排序'},
    ],
};

/*
[
    {label:'是否展示清除按钮',field:'allowClear',type:'boolean',defaultValue:true,version:'',desc:'是否展示清除按钮'},
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'',desc:'自动获取焦点'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'',desc:'是否有边框'},
    {label:'选择器类名',field:'className',type:'string',version:'',desc:'选择器类名'},
    {label:'自定义的清除图标',field:'clearIcon',type:'ReactNode',version:'',desc:'自定义的清除图标'},
    {label:'清除按钮的提示文案',field:'clearText',type:'string',defaultValue:'clear',version:'',desc:'清除按钮的提示文案'},
    {label:'默认时间',field:'defaultValue',type:'moment',version:'',desc:'默认时间'},
    {label:'禁用全部操作',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'禁用全部操作'},
    {label:'禁止选择部分小时选项',field:'disabledHours',type:'function()',version:'',desc:'禁止选择部分小时选项'},
    {label:'禁止选择部分分钟选项',field:'disabledMinutes',type:'function(selectedHour)',version:'',desc:'禁止选择部分分钟选项'},
    {label:'禁止选择部分秒选项',field:'disabledSeconds',type:'function(selectedHour, selectedMinute)',version:'',desc:'禁止选择部分秒选项'},
    {label:'展示的时间格式',field:'format',type:'string',defaultValue:'HH:mm:ss',version:'',desc:'展示的时间格式'},
    {label:'定义浮层的容器，默认为 body 上新建 div',field:'getPopupContainer',type:'function(trigger)',version:'',desc:'定义浮层的容器，默认为 body 上新建 div'},
    {label:'隐藏禁止选择的选项',field:'hideDisabledOptions',type:'boolean',defaultValue:false,version:'',desc:'隐藏禁止选择的选项'},
    {label:'小时选项间隔',field:'hourStep',type:'number',defaultValue:'1',version:'',desc:'小时选项间隔'},
    {label:'设置输入框为只读（避免在移动设备上打开虚拟键盘）',field:'inputReadOnly',type:'boolean',defaultValue:false,version:'',desc:'设置输入框为只读（避免在移动设备上打开虚拟键盘）'},
    {label:'分钟选项间隔',field:'minuteStep',type:'number',defaultValue:'1',version:'',desc:'分钟选项间隔'},
    {label:'面板是否打开',field:'open',type:'boolean',defaultValue:false,version:'',desc:'面板是否打开'},
    {label:'没有值的时候显示的内容',field:'placeholder',type:'radio-group',defaultValue:'请选择时间',version:'',options:[{value:'string',label:'string'},{value:'[string, string]',label:'[string, string]'}],desc:'没有值的时候显示的内容'},
    {label:'弹出层类名',field:'popupClassName',type:'string',version:'',desc:'弹出层类名'},
    {label:'弹出层样式对象',field:'popupStyle',type:'object',version:'',desc:'弹出层样式对象'},
    {label:'选择框底部显示自定义的内容',field:'renderExtraFooter',type:'() => ReactNode',version:'',desc:'选择框底部显示自定义的内容'},
    {label:'秒选项间隔',field:'secondStep',type:'number',defaultValue:'1',version:'',desc:'秒选项间隔'},
    {label:'面板是否显示“此刻”按钮',field:'showNow',type:'boolean',version:'4.4.0',desc:'面板是否显示“此刻”按钮'},
    {label:'自定义的选择框后缀图标',field:'suffixIcon',type:'ReactNode',version:'',desc:'自定义的选择框后缀图标'},
    {label:'使用 12 小时制，为 true 时 format 默认为 h:mm:ss a',field:'use12Hours',type:'boolean',defaultValue:false,version:'',desc:'使用 12 小时制，为 true 时 format 默认为 h:mm:ss a'},
    {label:'当前时间',field:'value',type:'moment',version:'',desc:'当前时间'},
    {label:'时间发生变化的回调',field:'onChange',type:'function(time: moment, timeString: string): void',version:'',desc:'时间发生变化的回调'},
    {label:'面板打开/关闭时的回调',field:'onOpenChange',type:'(open: boolean) => void',version:'',desc:'面板打开/关闭时的回调'}
]
* */
