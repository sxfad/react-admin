export default {
    isContainer: false,
    fields: [
        {label: '每页条数', field: 'pageSize', type: 'number', version: '', desc: '每页条数'},
        {label: '跳转至某页', field: 'showQuickJumper', type: 'boolean', defaultValue: false, version: '', desc: '是否可以快速跳转至某页'},
        {
            label: '尺寸', field: 'size', type: 'radio-group', defaultValue: 'default', version: '',
            options: [
                {value: 'default', label: '默认'},
                {value: 'small', label: '小号'},
            ],
            desc: '当为 small 时，是小尺寸分页',
        },
        {label: '数据总数', field: 'total', type: 'number', defaultValue: '0', version: '', desc: '数据总数'},
        {label: '显示数据总量', field: 'showTotal', type: 'string', version: '', desc: '用于显示数据总量和当前数据顺序'},
    ],
};

/*
[
    {label:'当前页数',field:'current',type:'number',version:'',desc:'当前页数'},
    {label:'默认的当前页数',field:'defaultCurrent',type:'number',defaultValue:'1',version:'',desc:'默认的当前页数'},
    {label:'默认的每页条数',field:'defaultPageSize',type:'number',defaultValue:'10',version:'',desc:'默认的每页条数'},
    {label:'禁用分页',field:'disabled',type:'boolean',version:'',desc:'禁用分页'},
    {label:'只有一页时是否隐藏分页器',field:'hideOnSinglePage',type:'boolean',defaultValue:false,version:'',desc:'只有一页时是否隐藏分页器'},
    {label:'用于自定义页码的结构，可用于优化 SEO',field:'itemRender',type:'radio-group',version:'',options:[{value:'(page, type: 'page'',label:'(page, type: 'page''},{value:''prev'',label:''prev''},{value:''next', originalElement) => React.ReactNode',label:''next', originalElement) => React.ReactNode'}],desc:'用于自定义页码的结构，可用于优化 SEO'},
    {label:'每页条数',field:'pageSize',type:'number',version:'',desc:'每页条数'},
    {label:'指定每页可以显示多少条',field:'pageSizeOptions',type:'string[]',defaultValue:'[10, 20, 50, 100]',version:'',desc:'指定每页可以显示多少条'},
    {label:'当 size 未指定时，根据屏幕宽度自动调整尺寸',field:'responsive',type:'boolean',version:'',desc:'当 size 未指定时，根据屏幕宽度自动调整尺寸'},
    {label:'是否显示较少页面内容',field:'showLessItems',type:'boolean',defaultValue:false,version:'',desc:'是否显示较少页面内容'},
    {label:'是否可以快速跳转至某页',field:'showQuickJumper',type:'radio-group',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'{ goButton: ReactNode }',label:'{ goButton: ReactNode }'}],desc:'是否可以快速跳转至某页'},
    {label:'是否展示 pageSize 切换器，当 total 大于 50 时默认为 true',field:'showSizeChanger',type:'boolean',version:'',desc:'是否展示 pageSize 切换器，当 total 大于 50 时默认为 true'},
    {label:'是否显示原生 tooltip 页码提示',field:'showTitle',type:'boolean',defaultValue:true,version:'',desc:'是否显示原生 tooltip 页码提示'},
    {label:'用于显示数据总量和当前数据顺序',field:'showTotal',type:'function(total, range)',version:'',desc:'用于显示数据总量和当前数据顺序'},
    {label:'当添加该属性时，显示为简单分页',field:'simple',type:'boolean',version:'',desc:'当添加该属性时，显示为简单分页'},
    {label:'当为 small 时，是小尺寸分页',field:'size',type:'radio-group',defaultValue:'default',version:'',options:[{value:'default',label:'default'},{value:'small',label:'small'}],desc:'当为 small 时，是小尺寸分页'},
    {label:'数据总数',field:'total',type:'number',defaultValue:'0',version:'',desc:'数据总数'},
    {label:'页码改变的回调，参数是改变后的页码及每页条数',field:'onChange',type:'function(page, pageSize)',version:'',desc:'页码改变的回调，参数是改变后的页码及每页条数'},
    {label:'pageSize 变化的回调',field:'onShowSizeChange',type:'function(current, size)',version:'',desc:'pageSize 变化的回调'}
]
* */
