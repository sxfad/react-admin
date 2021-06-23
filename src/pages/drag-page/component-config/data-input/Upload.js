import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    childrenDraggable: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用'},
        {label: '多选文件', category: '选项', field: 'multiple', type: 'boolean', defaultValue: false, version: '', desc: '是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件'},
        {label: '上传文件夹', category: '选项', field: 'directory', type: 'boolean', defaultValue: false, version: '', desc: '支持上传文件夹（caniuse）'},
        {
            label: '文件列表',
            category: '选项',
            field: 'showUploadList',
            type: 'boolean',
            defaultValue: true,
            version: 'function: 4.7.0',
            desc: '是否展示文件列表, 可设为一个对象，用于单独设定 showPreviewIcon, showRemoveIcon, showDownloadIcon, removeIcon 和 downloadIcon',
        },
        {label: '上传列表样式', field: 'listType', type: 'string', defaultValue: 'text', version: '', desc: '上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card'},
    ],
};

/*
[
    {label:'接受上传的文件类型, 详见 input accept Attribute',field:'accept',type:'string',version:'',desc:'接受上传的文件类型, 详见 input accept Attribute'},
    {label:'上传的地址',field:'action',type:'radio-group',version:'',options:[{value:'string',label:'string'},{value:'(file) => Promise<string>',label:'(file) => Promise<string>'}],desc:'上传的地址'},
    {label:'上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法',field:'beforeUpload',type:'radio-group',version:'',options:[{value:'(file, fileList) => boolean',label:'(file, fileList) => boolean'},{value:'Promise<File>',label:'Promise<File>'}],desc:'上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传（ resolve 传入 File 或 Blob 对象则上传 resolve 传入对象）。注意：IE9 不支持该方法'},
    {label:'通过覆盖默认的上传行为，可以自定义自己的上传实现',field:'customRequest',type:'function',version:'',desc:'通过覆盖默认的上传行为，可以自定义自己的上传实现'},
    {label:'上传所需额外参数或返回上传额外参数的方法',field:'data',type:'radio-group',version:'',options:[{value:'object|(file) => object',label:'object|(file) => object'},{value:'Promise<object>',label:'Promise<object>'}],desc:'上传所需额外参数或返回上传额外参数的方法'},
    {label:'默认已经上传的文件列表',field:'defaultFileList',type:'object[]',version:'',desc:'默认已经上传的文件列表'},
    {label:'支持上传文件夹（caniuse）',field:'directory',type:'boolean',defaultValue:false,version:'',desc:'支持上传文件夹（caniuse）'},
    {label:'是否禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'是否禁用'},
    {label:'已经上传的文件列表（受控），使用此参数时，如果遇到 onChange 只调用一次的问题，请参考 #2423',field:'fileList',type:'UploadFile[]',version:'',desc:'已经上传的文件列表（受控），使用此参数时，如果遇到 onChange 只调用一次的问题，请参考 #2423'},
    {label:'设置上传的请求头部，IE10 以上有效',field:'headers',type:'object',version:'',desc:'设置上传的请求头部，IE10 以上有效'},
    {label:'自定义显示 icon',field:'iconRender',type:'(file: UploadFile, listType?: UploadListType) => ReactNode',version:'',desc:'自定义显示 icon'},
    {label:'自定义缩略图是否使用 <img /> 标签进行显示',field:'isImageUrl',type:'(file: UploadFile) => boolean',defaultValue:'(内部实现)',version:'',desc:'自定义缩略图是否使用 <img /> 标签进行显示'},
    {label:'自定义上传列表项',field:'itemRender',type:'(originNode: ReactElement, file: UploadFile, fileList?: object[]) => React.ReactNode',version:'4.7.0',desc:'自定义上传列表项'},
    {label:'上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card',field:'listType',type:'string',defaultValue:'text',version:'',desc:'上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card'},
    {label:'上传请求的 http method',field:'method',type:'string',defaultValue:'post',version:'',desc:'上传请求的 http method'},
    {label:'是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件',field:'multiple',type:'boolean',defaultValue:false,version:'',desc:'是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件'},
    {label:'发到后台的文件参数名',field:'name',type:'string',defaultValue:'file',version:'',desc:'发到后台的文件参数名'},
    {label:'点击打开文件对话框',field:'openFileDialogOnClick',type:'boolean',defaultValue:true,version:'',desc:'点击打开文件对话框'},
    {label:'自定义文件预览逻辑',field:'previewFile',type:'radio-group',version:'',options:[{value:'(file: File',label:'(file: File'},{value:'Blob) => Promise<dataURL: string>',label:'Blob) => Promise<dataURL: string>'}],desc:'自定义文件预览逻辑'},
    {label:'自定义进度条样式',field:'progress',type:'ProgressProps（仅支持 type=\\'line\\'）',defaultValue:'{ strokeWidth: 2, showInfo: false }',version:'4.3.0',desc:'自定义进度条样式'},
    {label:'是否展示文件列表, 可设为一个对象，用于单独设定 showPreviewIcon, showRemoveIcon, showDownloadIcon, removeIcon 和 downloadIcon',field:'showUploadList',type:'radio-group',defaultValue:true,version:'function: 4.7.0',options:[{value:'boolean',label:'boolean'},{value:'{ showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean, removeIcon?: ReactNode',label:'{ showPreviewIcon?: boolean, showRemoveIcon?: boolean, showDownloadIcon?: boolean, removeIcon?: ReactNode'},{value:'(file: UploadFile) => ReactNode, downloadIcon?: ReactNode',label:'(file: UploadFile) => ReactNode, downloadIcon?: ReactNode'},{value:'(file: UploadFile) => ReactNode }',label:'(file: UploadFile) => ReactNode }'}],desc:'是否展示文件列表, 可设为一个对象，用于单独设定 showPreviewIcon, showRemoveIcon, showDownloadIcon, removeIcon 和 downloadIcon'},
    {label:'上传请求时是否携带 cookie',field:'withCredentials',type:'boolean',defaultValue:false,version:'',desc:'上传请求时是否携带 cookie'},
    {label:'上传文件改变时的状态，详见 onChange',field:'onChange',type:'function',version:'',desc:'上传文件改变时的状态，详见 onChange'},
    {label:'点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页',field:'onDownload',type:'function(file): void',defaultValue:'(跳转新标签页)',version:'',desc:'点击下载文件时的回调，如果没有指定，则默认跳转到文件 url 对应的标签页'},
    {label:'点击文件链接或预览图标时的回调',field:'onPreview',type:'function(file)',version:'',desc:'点击文件链接或预览图标时的回调'},
    {label:'点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除              ',field:'onRemove  ',type:'radio-group',defaultValue:'-  ',version:'',options:[{value:'function(file): boolean',label:'function(file): boolean'},{value:'Promise',label:'Promise'}],desc:'点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除              '}
]
* */
