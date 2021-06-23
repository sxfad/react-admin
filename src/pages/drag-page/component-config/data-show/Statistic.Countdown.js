import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '格式化t', field: 'format', type: 'string', defaultValue: 'HH:mm:ss', version: '', desc: '格式化倒计时展示，参考 moment'},
        {
            label: '数值前缀', field: 'prefix',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '设置数值的前缀',
        },
        {
            label: '数值后缀', field: 'suffix',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '设置数值的后缀',
        },
        {
            label: '数值标题', field: 'title',
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
            version: '',
            desc: '数值内容',
        },
    ],
};

/*
[
    {label:'格式化倒计时展示，参考 moment',field:'format',type:'string',defaultValue:'HH:mm:ss',version:'',desc:'格式化倒计时展示，参考 moment'},
    {label:'设置数值的前缀',field:'prefix',type:'ReactNode',version:'',desc:'设置数值的前缀'},
    {label:'设置数值的后缀',field:'suffix',type:'ReactNode',version:'',desc:'设置数值的后缀'},
    {label:'数值的标题',field:'title',type:'ReactNode',version:'',desc:'数值的标题'},
    {label:'数值内容',field:'value',type:'radio-group',version:'',options:[{value:'number',label:'number'},{value:'moment',label:'moment'}],desc:'数值内容'},
    {label:'设置数值的样式',field:'valueStyle',type:'CSSProperties',version:'',desc:'设置数值的样式'},
    {label:'倒计时完成时触发',field:'onFinish',type:'() => void',version:'',desc:'倒计时完成时触发'}
]
* */
