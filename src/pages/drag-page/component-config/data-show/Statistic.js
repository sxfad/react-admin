import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '小数点', field: 'decimalSeparator', type: 'string', defaultValue: '.', version: '', desc: '设置小数点'},
        {label: '千分位标识符', field: 'groupSeparator', type: 'string', defaultValue: ',', version: '', desc: '设置千分位标识符'},
        {label: '数值精度', field: 'precision', type: 'number', version: '', desc: '数值精度'},
        {label: '加载中', field: 'loading', type: 'boolean', defaultValue: false, version: '4.8.0', desc: '数值是否加载中'},
        {
            label: '数值的前缀', field: 'prefix',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '设置数值的前缀',
        },
        {
            label: '数值的后缀', field: 'suffix',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '设置数值的后缀',
        },
        {
            label: '数值的标题', field: 'title',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '数值的标题',
        },
        {
            label: '数值内容', field: 'value',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'number', label: '数字'},
            ],
            desc: '数值内容',
        },
    ],
};

/*
[
    {label:'设置小数点',field:'decimalSeparator',type:'string',defaultValue:'.',version:'',desc:'设置小数点'},
    {label:'自定义数值展示',field:'formatter',type:'(value) => ReactNode',version:'',desc:'自定义数值展示'},
    {label:'设置千分位标识符',field:'groupSeparator',type:'string',defaultValue:',',version:'',desc:'设置千分位标识符'},
    {label:'数值是否加载中',field:'loading',type:'boolean',defaultValue:false,version:'4.8.0',desc:'数值是否加载中'},
    {label:'数值精度',field:'precision',type:'number',version:'',desc:'数值精度'},
    {label:'设置数值的前缀',field:'prefix',type:'ReactNode',version:'',desc:'设置数值的前缀'},
    {label:'设置数值的后缀',field:'suffix',type:'ReactNode',version:'',desc:'设置数值的后缀'},
    {label:'数值的标题',field:'title',type:'ReactNode',version:'',desc:'数值的标题'},
    {label:'数值内容',field:'value',type:'radio-group',version:'',options:[{value:'string',label:'string'},{value:'number',label:'number'}],desc:'数值内容'},
    {label:'设置数值的样式',field:'valueStyle',type:'CSSProperties',version:'',desc:'设置数值的样式'}
]

* */
