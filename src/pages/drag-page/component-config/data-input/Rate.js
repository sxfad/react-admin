import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '可清除', category: '选项', field: 'allowClear', type: 'boolean', defaultValue: true, version: '', desc: '是否允许再次点击后清除'},
        {label: '可半选', category: '选项', field: 'allowHalf', type: 'boolean', defaultValue: false, version: '', desc: '是否允许半选'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '只读，无法进行交互'},
        {label: '自定义字符', field: 'character', type: 'ReactNode', version: 'function(): 4.4.0', desc: '自定义字符'},
        {label: 'star 总数', field: 'count', type: 'number', defaultValue: 5, version: '', desc: 'star 总数'},
    ],
};

/*
[
    {label:'是否允许再次点击后清除',field:'allowClear',type:'boolean',defaultValue:true,version:'',desc:'是否允许再次点击后清除'},
    {label:'是否允许半选',field:'allowHalf',type:'boolean',defaultValue:false,version:'',desc:'是否允许半选'},
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'',desc:'自动获取焦点'},
    {label:'自定义字符',field:'character',type:'radio-group',defaultValue:'<StarFilled />',version:'function(): 4.4.0',options:[{value:'ReactNode',label:'ReactNode'},{value:'(RateProps) => ReactNode',label:'(RateProps) => ReactNode'}],desc:'自定义字符'},
    {label:'自定义样式类名',field:'className',type:'string',version:'',desc:'自定义样式类名'},
    {label:'star 总数',field:'count',type:'number',defaultValue:'5',version:'',desc:'star 总数'},
    {label:'默认值',field:'defaultValue',type:'number',defaultValue:'0',version:'',desc:'默认值'},
    {label:'只读，无法进行交互',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'只读，无法进行交互'},
    {label:'自定义样式对象',field:'style',type:'CSSProperties',version:'',desc:'自定义样式对象'},
    {label:'自定义每项的提示信息',field:'tooltips',type:'string[]',version:'',desc:'自定义每项的提示信息'},
    {label:'当前数，受控值',field:'value',type:'number',version:'',desc:'当前数，受控值'},
    {label:'失去焦点时的回调',field:'onBlur',type:'function()',version:'',desc:'失去焦点时的回调'},
    {label:'选择时的回调',field:'onChange',type:'function(value: number)',version:'',desc:'选择时的回调'},
    {label:'获取焦点时的回调',field:'onFocus',type:'function()',version:'',desc:'获取焦点时的回调'},
    {label:'鼠标经过时数值变化的回调',field:'onHoverChange',type:'function(value: number)',version:'',desc:'鼠标经过时数值变化的回调'},
    {label:'按键回调',field:'onKeyDown',type:'function(event)',version:'',desc:'按键回调'}
]
* */
