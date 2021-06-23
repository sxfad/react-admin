export default {
    isContainer: false,
    fields: [
        {label: '图像描述', field: 'alt', type: 'string', version: '4.6.0', desc: '图像描述'},
        {label: '图片地址', field: 'src', type: 'image', version: '4.6.0', desc: '图片地址'},
        {label: '图像宽度', field: 'width', type: 'unit', version: '4.6.0', desc: '图像宽度'},
        {label: '图像高度', field: 'height', type: 'unit', version: '4.6.0', desc: '图像高度'},
    ],
};

/*
[
    {label:'图像描述',field:'alt',type:'string',version:'4.6.0',desc:'图像描述'},
    {label:'加载失败容错地址',field:'fallback',type:'string',version:'4.6.0',desc:'加载失败容错地址'},
    {label:'图像高度',field:'height',type:'radio-group',version:'4.6.0',options:[{value:'string',label:'string'},{value:'number',label:'number'}],desc:'图像高度'},
    {label:'加载占位, 为 true 时使用默认占位',field:'placeholder',type:'ReactNode',version:'4.6.0',desc:'加载占位, 为 true 时使用默认占位'},
    {label:'预览参数，为 false 时禁用',field:'preview',type:'radio-group',defaultValue:true,version:'4.6.0 previewType:4.7.0',options:[{value:'boolean',label:'boolean'},{value:'previewType',label:'previewType'}],desc:'预览参数，为 false 时禁用'},
    {label:'图片地址',field:'src',type:'string',version:'4.6.0',desc:'图片地址'},
    {label:'图像宽度',field:'width',type:'radio-group',version:'4.6.0',options:[{value:'string',label:'string'},{value:'number',label:'number'}],desc:'图像宽度'},
    {label:'加载错误回调',field:'onError',type:'(event: Event) => void',version:'4.12.0',desc:'加载错误回调'}
]
* */
