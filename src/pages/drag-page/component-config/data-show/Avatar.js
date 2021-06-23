export default {
    isContainer: false,
    fields: [
        {
            label: '头像图片', field: 'src', type: [
                {value: 'image', label: '地址'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: 'ReactNode: 4.8.0',
            desc: '图片类头像的资源地址或者图片元素',
        },
        {label: '替代文本', field: 'alt', type: 'string', version: '', desc: '图像无法显示时的替代文本'},
        {label: '字符两侧单位', field: 'gap', type: 'number', defaultValue: 4, version: '4.3.0', desc: '字符类型距离左右两侧边界单位像素'},
        {label: '头像图标', field: 'icon', type: 'ReactNode', version: '', desc: '设置头像的自定义图标'},
        {
            label: '头像形状', field: 'shape', type: 'radio-group', defaultValue: 'circle', version: '',
            options: [
                {value: 'circle', label: '原型'},
                {value: 'square', label: '方形'},
            ],
            desc: '指定头像的形状',
        },
        {
            label: '大小', field: 'size', type: 'radio-group', version: '',
            options: [
                {value: 'large', label: '大号'},
                {value: 'default', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            defaultValue: 'default',
            desc: '控件大小。注：标准表单内的输入框大小限制为 large',
        },
    ],
};

/*
[
    {label:'图像无法显示时的替代文本',field:'alt',type:'string',version:'',desc:'图像无法显示时的替代文本'},
    {label:'字符类型距离左右两侧边界单位像素',field:'gap',type:'number',defaultValue:'4',version:'4.3.0',desc:'字符类型距离左右两侧边界单位像素'},
    {label:'设置头像的自定义图标',field:'icon',type:'ReactNode',version:'',desc:'设置头像的自定义图标'},
    {label:'指定头像的形状',field:'shape',type:'radio-group',defaultValue:'circle',version:'',options:[{value:'circle',label:'circle'},{value:'square',label:'square'}],desc:'指定头像的形状'},
    {label:'设置头像的大小',field:'size',type:'radio-group',defaultValue:'default',version:'4.7.0',options:[{value:'number',label:'number'},{value:'large',label:'large'},{value:'small',label:'small'},{value:'default',label:'default'},{value:'{ xs: number, sm: number, ...}',label:'{ xs: number, sm: number, ...}'}],desc:'设置头像的大小'},
    {label:'图片类头像的资源地址或者图片元素',field:'src',type:'radio-group',version:'ReactNode: 4.8.0',options:[{value:'string',label:'string'},{value:'ReactNode',label:'ReactNode'}],desc:'图片类头像的资源地址或者图片元素'},
    {label:'设置图片类头像响应式资源地址',field:'srcSet',type:'string',version:'',desc:'设置图片类头像响应式资源地址'},
    {label:'图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为',field:'onError',type:'() => boolean',version:'',desc:'图片加载失败的事件，返回 false 会关闭组件默认的 fallback 行为'}
]
* */
