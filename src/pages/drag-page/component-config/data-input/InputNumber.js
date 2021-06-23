import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '4.12.0', desc: '是否有边框'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '-', desc: '禁用'},
        {label: '键盘操作', category: '选项', field: 'keyboard', type: 'boolean', defaultValue: true, version: '4.12.0', desc: '是否启用键盘快捷行为'},
        {label: '输入框提示', field: 'placeholder', type: 'string', version: ''},
        {label: '最小值', field: 'min', type: 'number', version: '-', desc: '最小值'},
        {label: '最大值', field: 'max', type: 'number', version: '-', desc: '最大值'},
        {label: '数值精度', field: 'precision', type: 'number', version: '-', desc: '数值精度'},
        {
            label: '控件大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '控件大小。注：标准表单内的输入框大小限制为 large',
        },
        {label: '每次改变步数', field: 'step', type: 'number', defaultValue: 1, version: '-', desc: '每次改变步数，可以为小数'},
    ],
};

/*
[
    {label:'自动获取焦点',field:'autoFocus',type:'boolean',defaultValue:false,version:'-',desc:'自动获取焦点'},
    {label:'是否有边框',field:'bordered',type:'boolean',defaultValue:true,version:'4.12.0',desc:'是否有边框'},
    {label:'小数点',field:'decimalSeparator',type:'string',version:'-',desc:'小数点'},
    {label:'初始值',field:'defaultValue',type:'number',version:'-',desc:'初始值'},
    {label:'禁用',field:'disabled',type:'boolean',defaultValue:false,version:'-',desc:'禁用'},
    {label:'指定输入框展示值的格式',field:'formatter',type:'radio-group',version:'-',options:[{value:'function(value: number',label:'function(value: number'},{value:'string): string',label:'string): string'}],desc:'指定输入框展示值的格式'},
    {label:'是否启用键盘快捷行为',field:'keyboard',type:'boolean',defaultValue:true,version:'4.12.0',desc:'是否启用键盘快捷行为'},
    {label:'最大值',field:'max',type:'number',defaultValue:'Number.MAX_SAFE_INTEGER',version:'-',desc:'最大值'},
    {label:'最小值',field:'min',type:'number',defaultValue:'Number.MIN_SAFE_INTEGER',version:'-',desc:'最小值'},
    {label:'指定从 formatter 里转换回数字的方式，和 formatter 搭配使用',field:'parser',type:'function(string): number',version:'-',desc:'指定从 formatter 里转换回数字的方式，和 formatter 搭配使用'},
    {label:'数值精度',field:'precision',type:'number',version:'-',desc:'数值精度'},
    {label:'只读',field:'readOnly',type:'boolean',defaultValue:false,version:'-',desc:'只读'},
    {label:'输入框大小',field:'size',type:'radio-group',version:'-',options:[{value:'large',label:'large'},{value:'middle',label:'middle'},{value:'small',label:'small'}],desc:'输入框大小'},
    {label:'每次改变步数，可以为小数',field:'step',type:'radio-group',defaultValue:'1',version:'-',options:[{value:'number',label:'number'},{value:'string',label:'string'}],desc:'每次改变步数，可以为小数'},
    {label:'当前值',field:'value',type:'number',version:'-',desc:'当前值'},
    {label:'变化回调',field:'onChange',type:'radio-group',version:'-',options:[{value:'function(value: number',label:'function(value: number'},{value:'string',label:'string'},{value:'null)',label:'null)'}],desc:'变化回调'},
    {label:'按下回车的回调',field:'onPressEnter',type:'function(e)',version:'-',desc:'按下回车的回调'},
    {label:'点击上下箭头的回调',field:'onStep',type:'radio-group',version:'4.7.0',options:[{value:'(value: number, info: { offset: number, type: 'up'',label:'(value: number, info: { offset: number, type: 'up''},{value:''down' }) => void',label:''down' }) => void'}],desc:'点击上下箭头的回调'}
]
* */
