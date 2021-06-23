export default {
    isContainer: false,
    fields: [
        {
            label: '描述内容', field: 'description',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},

            ],
            version: '', desc: '自定义描述内容',
        },
        {
            label: '显示图片', field: 'image',
            type: [
                {value: 'string', label: '图片地址'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '设置显示图片，为 string 时表示自定义图片地址。',
        },
    ],
};

/*
[
    {label:'自定义描述内容',field:'description',type:'ReactNode',version:'',desc:'自定义描述内容'},
    {label:'设置显示图片，为 string 时表示自定义图片地址。',field:'image',type:'ReactNode',defaultValue:'Empty.PRESENTED_IMAGE_DEFAULT',version:'',desc:'设置显示图片，为 string 时表示自定义图片地址。'},
    {label:'图片样式',field:'imageStyle',type:'CSSProperties',version:'',desc:'图片样式'}
]
* */
