import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: true,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {
            label: '标题', field: 'title',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '自定义标题文字',
        },
        {
            label: '二级标题', field: 'subTitle',
            type: [
                {value: 'string', label: '字符串'},
                {value: 'ReactNode', label: '组件'},
            ],
            version: '', desc: '自定义的二级标题文字',
        },
        {
            label: '返回图标',
            field: 'backIcon',
            type: 'ReactNode',
            version: '',
            desc: '自定义 back icon ，如果为 false 不渲染 back icon',
        },
        //
        //
        // {label: '标题栏旁的头像', field: 'avatar', type: 'AvatarProps', version: '', desc: '标题栏旁的头像'},
        // {label: '面包屑的配置', field: 'breadcrumb', type: 'Breadcrumb', version: '', desc: '面包屑的配置'},
        // {label: '自定义面包屑区域的内容', field: 'breadcrumbRender', type: '(props, originBreadcrumb) => ReactNode', version: '4.11.0', desc: '自定义面包屑区域的内容'},
        // {label: '操作区，位于 title 行的行尾', field: 'extra', type: 'ReactNode', version: '', desc: '操作区，位于 title 行的行尾'},
        // {label: 'PageHeader 的页脚，一般用于渲染 TabBar', field: 'footer', type: 'ReactNode', version: '', desc: 'PageHeader 的页脚，一般用于渲染 TabBar'},
        // {label: 'pageHeader 的类型，将会改变背景颜色', field: 'ghost', type: 'boolean', defaultValue: true, version: '', desc: 'pageHeader 的类型，将会改变背景颜色'},
        // {label: 'title 旁的 tag 列表', field: 'tags', type: 'radio-group', version: '', options: [{value: 'Tag[]', label: 'Tag[]'}, {value: 'Tag', label: 'Tag'}], desc: 'title 旁的 tag 列表'},
    ],
};
/*
[
    {label:'标题栏旁的头像',field:'avatar',type:'AvatarProps',version:'',desc:'标题栏旁的头像'},
    {label:'自定义 back icon ，如果为 false 不渲染 back icon',field:'backIcon',type:'radio-group',defaultValue:'<ArrowLeft />',version:'',options:[{value:'ReactNode',label:'ReactNode'},{value:'boolean',label:'boolean'}],desc:'自定义 back icon ，如果为 false 不渲染 back icon'},
    {label:'面包屑的配置',field:'breadcrumb',type:'Breadcrumb',version:'',desc:'面包屑的配置'},
    {label:'自定义面包屑区域的内容',field:'breadcrumbRender',type:'(props, originBreadcrumb) => ReactNode',version:'4.11.0',desc:'自定义面包屑区域的内容'},
    {label:'操作区，位于 title 行的行尾',field:'extra',type:'ReactNode',version:'',desc:'操作区，位于 title 行的行尾'},
    {label:'PageHeader 的页脚，一般用于渲染 TabBar',field:'footer',type:'ReactNode',version:'',desc:'PageHeader 的页脚，一般用于渲染 TabBar'},
    {label:'pageHeader 的类型，将会改变背景颜色',field:'ghost',type:'boolean',defaultValue:true,version:'',desc:'pageHeader 的类型，将会改变背景颜色'},
    {label:'自定义的二级标题文字',field:'subTitle',type:'ReactNode',version:'',desc:'自定义的二级标题文字'},
    {label:'title 旁的 tag 列表',field:'tags',type:'radio-group',version:'',options:[{value:'Tag[]',label:'Tag[]'},{value:'Tag',label:'Tag'}],desc:'title 旁的 tag 列表'},
    {label:'自定义标题文字',field:'title',type:'ReactNode',version:'',desc:'自定义标题文字'},
    {label:'返回按钮的点击事件',field:'onBack',type:'() => void',version:'',desc:'返回按钮的点击事件'}
]*/
