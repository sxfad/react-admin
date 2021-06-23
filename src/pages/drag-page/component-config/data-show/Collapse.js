import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    isContainer: true,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    dropAccept: ['Collapse.Panel'],
    fields: [
        {label: '手风琴模式', category: '选项', field: 'accordion', type: 'boolean', defaultValue: false, version: '', desc: '手风琴模式'},
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: true, version: '', desc: '带边框风格的折叠面板'},
        {label: '透明无边框', category: '选项', field: 'ghost', type: 'boolean', defaultValue: false, version: '4.4.0', desc: '使折叠面板透明且无边框'},
        {label: '切换图标位置', field: 'expandIconPosition', type: 'radio-group', defaultValue: 'left', version: '', options: [{value: 'left', label: '左'}, {value: 'right', label: '右'}], desc: '设置图标位置'},
    ],
};

/*
[
    {label:'手风琴模式',field:'accordion',type:'boolean',defaultValue:false,version:'',desc:'手风琴模式'},
    {label:'当前激活 tab 面板的 key',field:'activeKey',type:'radio-group',defaultValue:'默认无，accordion 模式下默认第一个元素',version:'',options:[{value:'string[]',label:'string[]'},{value:'string\\nnumber[]',label:'string\\nnumber[]'},{value:'number',label:'number'}],desc:'当前激活 tab 面板的 key'},
    {label:'带边框风格的折叠面板',field:'bordered',type:'boolean',defaultValue:true,version:'',desc:'带边框风格的折叠面板'},
    {label:'所有子面板是否可折叠或指定可折叠触发区域',field:'collapsible',type:'radio-group',version:'4.9.0',options:[{value:'header',label:'header'},{value:'disabled',label:'disabled'}],desc:'所有子面板是否可折叠或指定可折叠触发区域'},
    {label:'初始化选中面板的 key',field:'defaultActiveKey',type:'radio-group',version:'',options:[{value:'string[]',label:'string[]'},{value:'string\\nnumber[]',label:'string\\nnumber[]'},{value:'number',label:'number'}],desc:'初始化选中面板的 key'},
    {label:'销毁折叠隐藏的面板',field:'destroyInactivePanel',type:'boolean',defaultValue:false,version:'',desc:'销毁折叠隐藏的面板'},
    {label:'自定义切换图标',field:'expandIcon',type:'(panelProps) => ReactNode',version:'',desc:'自定义切换图标'},
    {label:'设置图标位置',field:'expandIconPosition',type:'radio-group',version:'',options:[{value:'left',label:'left'},{value:'right',label:'right'}],desc:'设置图标位置'},
    {label:'使折叠面板透明且无边框',field:'ghost',type:'boolean',defaultValue:false,version:'4.4.0',desc:'使折叠面板透明且无边框'},
    {label:'切换面板的回调',field:'onChange',type:'function',version:'',desc:'切换面板的回调'}
]
* */
