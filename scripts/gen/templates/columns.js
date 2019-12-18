const DELETE_THIS_LINE = 'DELETE_THIS_LINE';

/**
 * 获取列表页字符串
 */
module.exports = function (config) {
    let {
        base,
        pages,
        operators,
        columns,
    } = config;

    const isModalEdit = !!pages.find(item => item.typeName === '弹框表单');
    const isPageEdit = !isModalEdit && !!pages.find(item => item.typeName === '页面表单');
    const hasDelete = operators && !!operators.find(item => item.text === '删除');

    const operatorEdit = operators && operators.find(item => item.text === '修改');
    const operatorDelete = operators && operators.find(item => item.text === '删除');

    return `export default [
    ${columns.map(item => `{title: '${item.title}', dataIndex: '${item.dataIndex}'},`).join('\n    ')}
    ${operators ? `{
        title: '操作', dataIndex: 'operator', width: 100,
        render: (value, record) => {
            const {id, name} = record;
            ${hasDelete ? `const {singleDeleting} = this.state;
            const deleting = singleDeleting[id];` : DELETE_THIS_LINE}
            const items = [
                ${operatorEdit ? `{
                    label: '修改',
                    ${operatorEdit.iconMode ? `icon: '${operatorEdit.icon}',` : DELETE_THIS_LINE}
                    ${isModalEdit ? 'onClick: () => this.setState({visible: true, id}),' : DELETE_THIS_LINE}
                    ${isPageEdit ? `onClick: () => this.props.history.push(\`${base.path}/_/edit/\${id}\`),` : DELETE_THIS_LINE}
                },` : DELETE_THIS_LINE}
                ${operatorDelete ? `{
                    label: '删除',
                    ${operatorDelete.iconMode ? `icon: '${operatorDelete.icon}',` : DELETE_THIS_LINE}
                    color: 'red',
                    loading: deleting,
                    confirm: {
                        title: \`您确定删除"\${name}"?\`,
                        onConfirm: () => this.handleDelete(id),
                    },
                },` : DELETE_THIS_LINE}
                ${operators.filter(item => !['修改', '删除'].includes(item.text)).map(item => `{
                    label: '${item.text}',
                    ${item.iconMode ? `icon: '${item.icon}',` : DELETE_THIS_LINE}
                    onClick: this.${item.handle},
                },`).join('\n                        ')}
            ];

            return <Operator items={items}/>
        },
    },` : DELETE_THIS_LINE}
];`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
