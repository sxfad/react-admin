import {store} from 'src/models';

export default {
    editableContents: [
        {
            selector: options => {
                const {node} = options;
                return `th.id_${node.id}`;
            },
            propsField: 'title',

            // 表头点击，选中列
            onClick: e => options => {
                const {node, dragPageAction} = options;
                const {nodeSelectType} = store.getState().dragPage;
                if (nodeSelectType === 'meta') {
                    if ((e.metaKey || e.ctrlKey)) {
                        e.stopPropagation();
                        // 单纯选中节点，不进行其他操作
                        dragPageAction.setSelectedNodeId(node.id);
                    }
                }

                // 单击模式
                if (nodeSelectType === 'click') {
                    e.stopPropagation();
                    dragPageAction.setSelectedNodeId(node.id);
                }
            },
        },
    ],
    render: false,
    dropAccept: 'Table.Column',
    dropInTo: ['Table', 'Table.Column'],
    componentDisplayName: ({node}) => {
        const title = node.props?.title || '';

        return `Column ${title}`;
    },
    fields: [
        {label: '名称', field: 'title', type: 'string'},
        {label: '字段名', field: 'dataIndex', type: 'string'},
        {label: '宽度', field: 'width', type: 'unit'},
        {label: '渲染内容', field: 'render', type: 'ReactNode', functionType: true},
        {
            label: '列对齐方式', field: 'align', type: 'radio-group', defaultValue: 'left', version: '',
            options: [
                {value: 'left', label: '左对齐'},
                {value: 'center', label: '居中对齐'},
                {value: 'right', label: '右对齐'},
            ],
            desc: '设置列的对齐方式',
        },
        {
            label: '自动省略',
            category: '选项',
            categoryOrder: 5,
            field: 'ellipsis',
            type: 'boolean',
            defaultValue: false,
            version: 'showTitle: 4.3.0',
            desc: '超过宽度将自动省略，暂不支持和排序筛选一起使用。\\n设置为 true 或 { showTitle?: boolean } 时，表格布局将变成 tableLayout=\'fixed\'。',
        },
        {label: '排序', category: '选项', field: 'sorter', type: 'boolean', defaultValue: false},
        {
            label: '默认排序', appendField: 'sorter', field: 'defaultSortOrder', type: 'radio-group', version: '',
            options: [
                {value: 'ascend', label: '升序'},
                {value: 'descend', label: '降序'}],
            desc: '默认排序顺序',
        },
        {
            label: '列固定', field: 'fixed', type: 'radio-group', version: '',
            options: [
                {value: 'left', label: '左固定'},
                {value: 'right', label: '右固定'},
            ],
            desc: '设置列的固定方式',
        },
    ],
};


