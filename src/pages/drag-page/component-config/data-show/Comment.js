export default {
    isContainer: false,
    fields: [
        {label: '操作项列表', field: 'actions', type: 'Array<ReactNode>', version: '', desc: '在评论内容下面呈现的操作项列表'},
        {label: '作者组件', field: 'author', type: 'ReactNode', version: '', desc: '要显示为注释作者的元素'},
        {label: '评论头像', field: 'avatar', type: 'ReactNode', version: '', desc: '要显示为评论头像的元素 - 通常是 antd Avatar 或者 src'},
        {label: '嵌套注释应作为注释的子项提供', field: 'children', type: 'ReactNode', version: '', desc: '嵌套注释应作为注释的子项提供'},
        {label: '内容', field: 'content', type: 'ReactNode', version: '', desc: '评论的主要内容'},
        {label: '时间', field: 'datetime', type: 'ReactNode', version: '', desc: '展示时间描述'},
    ],
};
/*
[
    {label:'在评论内容下面呈现的操作项列表',field:'actions',type:'Array<ReactNode>',version:'',desc:'在评论内容下面呈现的操作项列表'},
    {label:'要显示为注释作者的元素',field:'author',type:'ReactNode',version:'',desc:'要显示为注释作者的元素'},
    {label:'要显示为评论头像的元素 - 通常是 antd Avatar 或者 src',field:'avatar',type:'ReactNode',version:'',desc:'要显示为评论头像的元素 - 通常是 antd Avatar 或者 src'},
    {label:'嵌套注释应作为注释的子项提供',field:'children',type:'ReactNode',version:'',desc:'嵌套注释应作为注释的子项提供'},
    {label:'评论的主要内容',field:'content',type:'ReactNode',version:'',desc:'评论的主要内容'},
    {label:'展示时间描述',field:'datetime',type:'ReactNode',version:'',desc:'展示时间描述'}
]
* */
