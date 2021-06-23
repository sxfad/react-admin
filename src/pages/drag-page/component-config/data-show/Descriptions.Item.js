export default {
    isContainer: true,
    fields: [
        // {label:'自定义内容样式',field:'contentStyle',type:'CSSProperties',version:'4.9.0',desc:'自定义内容样式'},
        {
            label: '内容的描述', field: 'label',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},

            ],
            version: '', desc: '内容的描述',
        },
        // {label: '自定义标签样式', field: 'labelStyle', type: 'CSSProperties', version: '4.9.0', desc: '自定义标签样式'},
        {label: '包含列的数量', field: 'span', type: 'number', defaultValue: 1, version: '', desc: '包含列的数量'},
    ],
}

/*
[
    {label:'自定义内容样式',field:'contentStyle',type:'CSSProperties',version:'4.9.0',desc:'自定义内容样式'},
    {label:'内容的描述',field:'label',type:'ReactNode',version:'',desc:'内容的描述'},
    {label:'自定义标签样式',field:'labelStyle',type:'CSSProperties',version:'4.9.0',desc:'自定义标签样式'},
    {label:'包含列的数量',field:'span',type:'number',defaultValue:'1',version:'',desc:'包含列的数量'}
]
* */
