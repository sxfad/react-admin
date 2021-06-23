import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '是否禁用'},
        {label: '单向', category: '选项', field: 'oneWay', type: 'boolean', defaultValue: false, version: '4.3.0', desc: '展示为单向样式'},
        {label: '可搜索', category: '选项', field: 'showSearch', type: 'boolean', defaultValue: false, version: '', desc: '是否显示搜索框'},
        {label: '全选', category: '选项', field: 'showSelectAll', type: 'boolean', defaultValue: true, version: '', desc: '是否展示全选勾选框'},
        {label: '标题', field: 'titles', type: {value: 'array', length: 2, type: 'string'}, version: '', desc: '标题集合，顺序从左至右'},
    ],
};
/*
[
    {label:'数据源，其中的数据将会被渲染到左边一栏中，targetKeys 中指定的除外',field:'dataSource',type:'RecordType extends TransferItem = TransferItem[]',defaultValue:'[]',version:'',desc:'数据源，其中的数据将会被渲染到左边一栏中，targetKeys 中指定的除外'},
    {label:'是否禁用',field:'disabled',type:'boolean',defaultValue:false,version:'',desc:'是否禁用'},
    {label:'接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false',field:'filterOption',type:'(inputValue, option): boolean',version:'',desc:'接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false'},
    {label:'底部渲染函数',field:'footer',type:'(props) => ReactNode',version:'',desc:'底部渲染函数'},
    {label:'两个穿梭框的自定义样式',field:'listStyle',type:'radio-group',version:'',options:[{value:'object|({direction: left',label:'object|({direction: left'},{value:'right}) => object',label:'right}) => object'}],desc:'两个穿梭框的自定义样式'},
    {label:'各种语言',field:'locale',type:'{ itemUnit: string; itemsUnit: string; searchPlaceholder: string; notFoundContent: ReactNode; }',defaultValue:'{ itemUnit: 项, itemsUnit: 项, searchPlaceholder: 请输入搜索内容 }',version:'',desc:'各种语言'},
    {label:'展示为单向样式',field:'oneWay',type:'boolean',defaultValue:false,version:'4.3.0',desc:'展示为单向样式'},
    {label:'操作文案集合，顺序从上至下',field:'operations',type:'string[]',defaultValue:'[>, <]',version:'',desc:'操作文案集合，顺序从上至下'},
    {label:'使用分页样式，自定义渲染列表下无效',field:'pagination',type:'radio-group',defaultValue:'false',version:'4.3.0',options:[{value:'boolean',label:'boolean'},{value:'{ pageSize: number }',label:'{ pageSize: number }'}],desc:'使用分页样式，自定义渲染列表下无效'},
    {label:'每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。或者返回一个普通对象，其中 label 字段为 ReactElement，value 字段为 title',field:'render',type:'(record) => ReactNode',version:'',desc:'每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。或者返回一个普通对象，其中 label 字段为 ReactElement，value 字段为 title'},
    {label:'自定义顶部多选框标题的集合',field:'selectAllLabels',type:'radio-group',version:'',options:[{value:'(ReactNode',label:'(ReactNode'},{value:'(info: { selectedCount: number, totalCount: number }) => ReactNode)[]',label:'(info: { selectedCount: number, totalCount: number }) => ReactNode)[]'}],desc:'自定义顶部多选框标题的集合'},
    {label:'设置哪些项应该被选中',field:'selectedKeys',type:'string[]',defaultValue:'[]',version:'',desc:'设置哪些项应该被选中'},
    {label:'是否显示搜索框',field:'showSearch',type:'boolean',defaultValue:false,version:'',desc:'是否显示搜索框'},
    {label:'是否展示全选勾选框',field:'showSelectAll',type:'boolean',defaultValue:true,version:'',desc:'是否展示全选勾选框'},
    {label:'显示在右侧框数据的 key 集合',field:'targetKeys',type:'string[]',defaultValue:'[]',version:'',desc:'显示在右侧框数据的 key 集合'},
    {label:'标题集合，顺序从左至右',field:'titles',type:'ReactNode[]',version:'',desc:'标题集合，顺序从左至右'},
    {label:'选项在两栏之间转移时的回调函数',field:'onChange',type:'(targetKeys, direction, moveKeys): void',version:'',desc:'选项在两栏之间转移时的回调函数'},
    {label:'选项列表滚动时的回调函数',field:'onScroll',type:'(direction, event): void',version:'',desc:'选项列表滚动时的回调函数'},
    {label:'搜索框内容时改变时的回调函数',field:'onSearch',type:'radio-group',version:'',options:[{value:'(direction: left',label:'(direction: left'},{value:'right, value: string): void',label:'right, value: string): void'}],desc:'搜索框内容时改变时的回调函数'},
    {label:'选中项发生改变时的回调函数',field:'onSelectChange',type:'(sourceSelectedKeys, targetSelectedKeys): void',version:'',desc:'选中项发生改变时的回调函数'}
]
* */
