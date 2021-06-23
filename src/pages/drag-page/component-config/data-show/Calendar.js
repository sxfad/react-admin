import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: false,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        {label: '是否全屏显示', field: 'fullscreen', type: 'boolean', defaultValue: true, version: '', desc: '是否全屏显示'},
        {label: '初始模式', field: 'mode', type: 'radio-group', defaultValue: 'month', version: '', options: [{value: 'month', label: '月份'}, {value: 'year', label: '年份'}], desc: '初始模式'},
    ],
};
/*
[
    {label:'自定义渲染日期单元格，返回内容会被追加到单元格',field:'dateCellRender',type:'function(date: moment): ReactNode',version:'',desc:'自定义渲染日期单元格，返回内容会被追加到单元格'},
    {label:'自定义渲染日期单元格，返回内容覆盖单元格',field:'dateFullCellRender',type:'function(date: moment): ReactNode',version:'',desc:'自定义渲染日期单元格，返回内容覆盖单元格'},
    {label:'默认展示的日期',field:'defaultValue',type:'moment',version:'',desc:'默认展示的日期'},
    {label:'不可选择的日期',field:'disabledDate',type:'(currentDate: moment) => boolean',version:'',desc:'不可选择的日期'},
    {label:'是否全屏显示',field:'fullscreen',type:'boolean',defaultValue:true,version:'',desc:'是否全屏显示'},
    {label:'自定义头部内容',field:'headerRender',type:'function(object:{value: moment, type: string, onChange: f(), onTypeChange: f()})',version:'',desc:'自定义头部内容'},
    {label:'国际化配置',field:'locale',type:'object',defaultValue:'(默认配置)',version:'',desc:'国际化配置'},
    {label:'初始模式',field:'mode',type:'radio-group',defaultValue:'month',version:'',options:[{value:'month',label:'month'},{value:'year',label:'year'}],desc:'初始模式'},
    {label:'自定义渲染月单元格，返回内容会被追加到单元格',field:'monthCellRender',type:'function(date: moment): ReactNode',version:'',desc:'自定义渲染月单元格，返回内容会被追加到单元格'},
    {label:'自定义渲染月单元格，返回内容覆盖单元格',field:'monthFullCellRender',type:'function(date: moment): ReactNode',version:'',desc:'自定义渲染月单元格，返回内容覆盖单元格'},
    {label:'设置可以显示的日期',field:'validRange',type:'[moment, moment]',version:'',desc:'设置可以显示的日期'},
    {label:'展示日期',field:'value',type:'moment',version:'',desc:'展示日期'},
    {label:'日期变化回调',field:'onChange',type:'function(date: moment）',version:'',desc:'日期变化回调'},
    {label:'日期面板变化回调',field:'onPanelChange',type:'function(date: moment, mode: string)',version:'',desc:'日期面板变化回调'},
    {label:'点击选择日期回调',field:'onSelect',type:'function(date: moment）',version:'',desc:'点击选择日期回调'}
]
* */
