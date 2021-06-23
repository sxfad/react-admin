import {fixDragProps} from 'src/pages/drag-page/util';

export default {
    editableContents: [
        {
            selector: '.ant-collapse-header',
            propsField: 'header',
        },
    ],
    isContainer: true,
    dropInTo: 'Collapse',
    withHolder: true,
    withDragProps: false,
    hooks: {
        afterRender: fixDragProps,
    },
    fields: [
        // { // 不好用
        //     label: '是否可折叠', field: 'collapsible', type: 'radio-group', version: '4.9.0',
        //     options: [
        //         {value: 'header', label: '点击头部'},
        //         {value: 'disabled', label: '禁止'},
        //     ], desc: '是否可折叠或指定可折叠触发区域',
        // },
        // {label: '被隐藏时是否渲染 DOM 结构', field: 'forceRender', type: 'boolean', defaultValue: false, version: '', desc: '被隐藏时是否渲染 DOM 结构'},
        // {label: '面板头内容', field: 'header', type: 'ReactNode', version: '', desc: '面板头内容'},
        {label: '面板头内容', field: 'header', type: [{value: 'string', label: '字符串'}, {value: 'ReactNode', label: '组件'}], version: '', desc: '面板头内容'},
        {label: '面板右上角', field: 'extra', type: 'ReactNode', version: '', desc: '自定义渲染每个面板右上角的内容'},
        {label: 'key', field: 'key', type: 'string', version: '', desc: '对应 activeKey'},
        {label: '展示箭头', field: 'showArrow', type: 'boolean', defaultValue: true, version: '', desc: '是否展示当前面板上的箭头'},
    ],
};
