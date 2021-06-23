import React from 'react';
import {fixDragProps, getFieldOption} from 'src/pages/drag-page/util';

export default {
    dropAccept: 'Table.Column',
    withDragProps: false,
    hooks: {
        beforeRender: options => {
            setTableColumns(options);
        },
        beforeSchemaEdit: options => {
            const {node} = options;
            if (node?.props) {
                Reflect.deleteProperty(node.props, 'columns');
            }
        },
        afterRender: fixDragProps,
        beforeToCode: ({node}) => {
            const {columns, rowSelection} = node.props || {};
            const {children = []} = node;
            node.variables = ['columns'];

            node.props.dataSource = 'state.dataSource<---->[]';
            if (columns?.length) {
                columns.forEach((col, index) => {
                    // 清除默认值
                    const tableColumn = children[index];
                    Object.entries((tableColumn.props || {}))
                        .forEach(([key, value]) => {
                            const fieldOption = getFieldOption(tableColumn, key) || {};
                            const {defaultValue} = fieldOption;

                            // 删除默认值
                            if (JSON.stringify(defaultValue) === JSON.stringify(value)) {
                                Reflect.deleteProperty(col, key);
                            }
                        });

                    // 处理render
                    const {props: {render}} = tableColumn;
                    if (render) col.render = render;

                    // 删除 className id_{uuid}
                    Reflect.deleteProperty(col, 'className');
                });
            }

            if (rowSelection === true) {
                node.props.rowSelection = {
                    selectedRowKeys: 'state.selectedRowKeys<---->[]',
                    onChange: 'selectedRowKeys => state.setSelectedRowKeys(selectedRowKeys)',
                };
            }
        },
    },
    fields: [
        {label: '边框', category: '选项', field: 'bordered', type: 'boolean', defaultValue: false, version: '', desc: '是否展示外边框和列边框'},
        {label: '加载中', category: '选项', field: 'loading', type: 'boolean', defaultValue: false, version: '', desc: '页面是否加载中'},
        {label: '分页', category: '选项', field: 'pagination', type: 'boolean', version: '', desc: '分页器，参考配置项或 pagination 文档，设为 false 时不展示和进行分页'},
        {label: '可选', category: '选项', field: 'rowSelection', type: 'boolean', version: '', desc: '表格行是否可选择，配置项'},
        {label: '表头', category: '选项', field: 'showHeader', type: 'boolean', defaultValue: true, version: '', desc: '是否显示表头'},
        {
            label: '表格大小', field: 'size', type: 'radio-group', defaultValue: 'default', version: '',
            options: [
                {value: 'default', label: '默认'},
                {value: 'middle', label: '中号'},
                {value: 'small', label: '小号'},
            ],
            desc: '表格大小',
        },
        {label: '快速编辑列', field: '__columns', type: 'ColumnFast'},
        {
            label: '表格滚动', field: 'scroll',
            type: {
                value: 'object',
                fields: [
                    {label: '自动滚动到顶部', field: 'scrollToFirstRowOnChange', type: 'boolean', defaultValue: false},
                    {label: '纵向滚动', field: 'y', type: 'unit'},
                    {label: '横向滚动', field: 'x', type: 'unit'},
                ],
            },
            version: '', desc: '表格是否可滚动，也可以指定滚动区域的宽、高，配置项',
        },
        {
            label: '行展开属性', field: 'expandable',
            type: {
                value: 'object',
                fields: [
                    {label: '展开列宽', field: 'columnWidth', type: 'unit', desc: '自定义展开列宽度'},
                    {label: '展开行内容', field: 'expandedRowRender', type: 'ReactNode', functionType: true, desc: '额外的展开行'},
                    {label: '点击行展开', field: 'expandRowByClick', type: 'boolean', desc: '通过点击行来展开子行'},
                    {label: '缩进', field: 'indentSize', type: 'number', defaultValue: 15, desc: '展示树形数据时，每层缩进的宽度，以 px 为单位'},
                ],
            },
            version: '', desc: '配置展开属性',
        },
    ],
};


function setTableColumns({node: tableNode, NodeRender, renderProps, props}) {
    if (!tableNode) return;

    let {children} = tableNode;
    if (!props.columns) props.columns = [];

    if (!children?.length) {
        props.columns = [];
        return;
    }

    const loop = (node, columns) => {
        const {id, props, children} = node;
        const {render, ...otherProps} = props;
        const col = {...otherProps, className: `id_${id}`};
        if (render) col.render = () => <NodeRender {...renderProps} config={render}/>;

        columns.push(col);
        if (children?.length) {
            col.children = [];
            children.forEach(item => loop(item, col.children));
        }
    };
    const columns = [];
    children.forEach(node => loop(node, columns));

    props.columns = columns;
    if (!tableNode.props) tableNode.props = {};
    tableNode.props.columns = columns;
}


/*
[
    {label:'是否展示外边框和列边框',field:'bordered',type:'boolean',defaultValue:false,version:'',desc:'是否展示外边框和列边框'},
    {label:'表格列的配置描述，具体项见下表',field:'columns',type:'ColumnsType[]',version:'',desc:'表格列的配置描述，具体项见下表'},
    {label:'覆盖默认的 table 元素',field:'components',type:'TableComponents',version:'',desc:'覆盖默认的 table 元素'},
    {label:'数据数组',field:'dataSource',type:'object[]',version:'',desc:'数据数组'},
    {label:'配置展开属性',field:'expandable',type:'expandable',version:'',desc:'配置展开属性'},
    {label:'表格尾部',field:'footer',type:'function(currentPageData)',version:'',desc:'表格尾部'},
    {label:'设置表格内各类浮层的渲染节点，如筛选菜单',field:'getPopupContainer',type:'(triggerNode) => HTMLElement',defaultValue:'() => TableHtmlElement',version:'',desc:'设置表格内各类浮层的渲染节点，如筛选菜单'},
    {label:'页面是否加载中',field:'loading',type:'radio-group',defaultValue:'false',version:'',options:[{value:'boolean',label:'boolean'},{value:'object (更多)',label:'object (更多)'}],desc:'页面是否加载中'},
    {label:'默认文案设置，目前包括排序、过滤、空数据文案',field:'locale',type:'object',defaultValue:'filterConfirm: 确定\\nfilterReset: 重置\\nemptyText: 暂无数据\\n默认值',version:'',desc:'默认文案设置，目前包括排序、过滤、空数据文案'},
    {label:'分页器，参考配置项或 pagination 文档，设为 false 时不展示和进行分页',field:'pagination',type:'object',version:'',desc:'分页器，参考配置项或 pagination 文档，设为 false 时不展示和进行分页'},
    {label:'表格行的类名',field:'rowClassName',type:'function(record, index): string',version:'',desc:'表格行的类名'},
    {label:'表格行 key 的取值，可以是字符串或一个函数',field:'rowKey',type:'radio-group',defaultValue:'key',version:'',options:[{value:'string',label:'string'},{value:'function(record): string',label:'function(record): string'}],desc:'表格行 key 的取值，可以是字符串或一个函数'},
    {label:'表格行是否可选择，配置项',field:'rowSelection',type:'object',version:'',desc:'表格行是否可选择，配置项'},
    {label:'表格是否可滚动，也可以指定滚动区域的宽、高，配置项',field:'scroll',type:'object',version:'',desc:'表格是否可滚动，也可以指定滚动区域的宽、高，配置项'},
    {label:'是否显示表头',field:'showHeader',type:'boolean',defaultValue:true,version:'',desc:'是否显示表头'},
    {label:'表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性',field:'showSorterTooltip',type:'radio-group',defaultValue:true,version:'',options:[{value:'boolean',label:'boolean'},{value:'Tooltip props',label:'Tooltip props'}],desc:'表头是否显示下一次排序的 tooltip 提示。当参数类型为对象时，将被设置为 Tooltip 的属性'},
    {label:'表格大小',field:'size',type:'radio-group',defaultValue:'default',version:'',options:[{value:'default',label:'default'},{value:'middle',label:'middle'},{value:'small',label:'small'}],desc:'表格大小'},
    {label:'支持的排序方式，取值为 ascend descend',field:'sortDirections',type:'Array',defaultValue:'[ascend, descend]',version:'',desc:'支持的排序方式，取值为 ascend descend'},
    {label:'设置粘性头部和滚动条',field:'sticky',type:'radio-group',version:'4.6.0 (getContainer: 4.7.0)',options:[{value:'boolean',label:'boolean'},{value:'{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}',label:'{offsetHeader?: number, offsetScroll?: number, getContainer?: () => HTMLElement}'}],desc:'设置粘性头部和滚动条'},
    {label:'总结栏',field:'summary',type:'(currentData) => ReactNode',version:'',desc:'总结栏'},
    {label:'表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局',field:'tableLayout',type:'radio-group',defaultValue:'无\\n固定表头/列或使用了 column.ellipsis 时，默认值为 fixed',version:'',options:[{value:'-',label:'-'},{value:'auto',label:'auto'},{value:'fixed',label:'fixed'}],desc:'表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局'},
    {label:'表格标题',field:'title',type:'function(currentPageData)',version:'',desc:'表格标题'},
    {label:'分页、排序、筛选变化时触发',field:'onChange',type:'radio-group',version:'',options:[{value:'function(pagination, filters, sorter, extra: { currentDataSource: [], action: paginate',label:'function(pagination, filters, sorter, extra: { currentDataSource: [], action: paginate'},{value:'sort',label:'sort'},{value:'filter })',label:'filter })'}],desc:'分页、排序、筛选变化时触发'},
    {label:'设置头部行属性',field:'onHeaderRow',type:'function(columns, index)',version:'',desc:'设置头部行属性'},
    {label:'设置行属性',field:'onRow',type:'function(record, index)',version:'',desc:'设置行属性'}
]
* */
