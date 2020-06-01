const DELETE_THIS_LINE = 'DELETE_THIS_LINE';
const WITH_OPTIONS_TYPE = ['select', 'radio-group', 'checkbox-group'];

function renderTime(item) {
    const {title, dataIndex} = item;
    const timeStr = `, render: value => value ? moment(value).format('YYYY-MM-DD HH:mm') : null`;
    const dateStr = `, render: value => value ? moment(value).format('YYYY-MM-DD') : null`;

    if (title && title.includes('日期')) return dateStr;
    if (title && title.includes('时间')) return timeStr;
    if (dataIndex && dataIndex.toLowerCase().endsWith('time')) return timeStr;
    if (dataIndex && dataIndex.toLowerCase().endsWith('date')) return dateStr;

    return '';
}

/**
 * 获取列表页字符串
 */
module.exports = function (config) {
    let {
        base,
        pages,
        queries,
        tools,
        operators,
        table,
        columns,
    } = config;
    console.log(config);

    if (queries && !queries.length) queries = null;

    if (!table) table = {};

    const isModalEdit = !!pages.find(item => item.typeName === '弹框表单');
    const isPageEdit = !isModalEdit && !!pages.find(item => item.typeName === '页面表单');
    const hasDelete = operators && !!operators.find(item => item.text === '删除');
    const hasBatchDelete = tools && !!tools.find(item => item.text === '删除');
    let handles = null;
    const excludeHandles = ['handleDelete', 'handleBatchDelete'];
    [...(tools || []), ...(operators || [])].forEach(item => {
        const {handle} = item;
        if (handle && !excludeHandles.includes(handle)) {
            if (!handles) handles = [];
            handles.push(handle);
        }
    });

    const operatorEdit = operators && operators.find(item => item.text === '修改');
    const operatorDelete = operators && operators.find(item => item.text === '删除');

    return `import React, {Component} from 'react';
${tools || queries || hasBatchDelete ? `import {${(queries || tools) ? 'Button, ' : ''}${queries ? 'Form, ' : ''}} from 'antd';` : DELETE_THIS_LINE}
${columns.find(renderTime) ? `import moment from 'moment';` : DELETE_THIS_LINE}
import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {
    ${queries ? 'QueryBar,' : DELETE_THIS_LINE}
    ${(!queries && tools) ? 'ToolBar,' : DELETE_THIS_LINE}
    ${queries ? 'FormRow,' : DELETE_THIS_LINE}
    ${queries ? 'FormElement,' : DELETE_THIS_LINE}
    Table,
    ${operators ? 'Operator,' : DELETE_THIS_LINE}
    ${table.pagination ? 'Pagination,' : DELETE_THIS_LINE}
} from 'src/library/components';
${hasBatchDelete ? `import batchDeleteConfirm from 'src/components/batch-delete-confirm';` : DELETE_THIS_LINE}
${isModalEdit ? 'import EditModal from \'./EditModal\';' : DELETE_THIS_LINE}

@config({
    path: '${base.path}',
    ${isPageEdit ? 'router: true,' : DELETE_THIS_LINE}
})
export default class ${base.ModuleName}List extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        ${table.selectable ? 'selectedRowKeys: [],// 表格中选中行keys' : DELETE_THIS_LINE}
        ${table.pagination ? 'total: 0,           // 分页中条数' : DELETE_THIS_LINE}
        ${table.pagination ? 'pageNum: 1,         // 分页当前页' : DELETE_THIS_LINE}
        ${table.pagination ? 'pageSize: 20,       // 分页每页显示条数' : DELETE_THIS_LINE}
        ${(hasDelete || hasBatchDelete) ? 'deleting: false,    // 删除中loading' : DELETE_THIS_LINE}
        ${isModalEdit ? 'visible: false,     // 添加、修改弹框' : DELETE_THIS_LINE}
        ${isModalEdit ? 'id: null,           // 需要修改的数据id' : DELETE_THIS_LINE}
    };

    columns = [
        ${columns.map(item => `{title: '${item.title}', dataIndex: '${item.dataIndex}', width: 200${renderTime(item)}},`).join('\n        ')}
        ${operators ? `{
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
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
    ];

    componentDidMount() {
        this.handleSubmit();
    }

    handleSubmit = async () => {
        if (this.state.loading) return;

        ${queries ? 'const values = await this.form.validateFields();\n' : DELETE_THIS_LINE}
        ${table.pagination ? 'const {pageNum, pageSize} = this.state;' : DELETE_THIS_LINE}
        const params = {
            ${queries ? '...values,' : DELETE_THIS_LINE}
            ${table.pagination ? `pageNum,
            pageSize,` : DELETE_THIS_LINE}
        };

        this.setState({loading: true});
        this.props.ajax.${base.ajax.search.method}('${base.ajax.search.url}', params)
            .then(res => {
                const dataSource = res?.list || [];
                const total = res?.total || 0;

                this.setState({dataSource, total});
            })
            .finally(() => this.setState({loading: false}));
    };

    ${hasDelete ? `handleDelete = (id) => {
        if(this.state.deleting) return;

        this.setState({deleting: true});
        this.props.ajax.${base.ajax.delete.method}(\`${base.ajax.delete.url.replace('{id}', '${id}')}\`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
            .then(() => this.handleSubmit())
            .finally(() => this.setState({deleting: false}));
    };` : DELETE_THIS_LINE}

    ${hasBatchDelete ? `handleBatchDelete = () => {
        if (this.state.deleting) return;

        const {selectedRowKeys} = this.state;
        batchDeleteConfirm(selectedRowKeys.length)
            .then(() => {
                this.setState({deleting: true});
                this.props.ajax.${base.ajax.batchDelete.method}('${base.ajax.batchDelete.url}', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'})
                    .then(() => {
                        this.setState({selectedRowKeys: []});
                        this.handleSubmit();
                    })
                    .finally(() => this.setState({deleting: false}));
            });
    };` : DELETE_THIS_LINE}

    ${handles ? handles.map(item => `${item} = () => {
        // TODO
    };
    `).join('\n    ') : DELETE_THIS_LINE}
    render() {
        const {
            loading,
            ${hasBatchDelete || hasDelete ? 'deleting,' : DELETE_THIS_LINE}
            dataSource,
            ${table.selectable ? 'selectedRowKeys,' : DELETE_THIS_LINE}
            ${table.pagination ? 'total,' : DELETE_THIS_LINE}
            ${table.pagination ? 'pageNum,' : DELETE_THIS_LINE}
            ${table.pagination ? 'pageSize,' : DELETE_THIS_LINE}
            ${isModalEdit ? 'visible,' : DELETE_THIS_LINE}
            ${isModalEdit ? 'id,' : DELETE_THIS_LINE}
        } = this.state;

        ${queries ? `const formProps = {
            width: 220,
            style: {paddingLeft: 16},
        };` : DELETE_THIS_LINE}
        ${hasBatchDelete && table.selectable ? 'const disabledDelete = !selectedRowKeys?.length;' : DELETE_THIS_LINE}

        return (
            <PageContent loading={loading${hasBatchDelete || hasDelete ? ' || deleting' : ''}}>
                ${queries ? `<QueryBar>
                    <Form
                        name="${base.moduleName}-query"
                        ref={form => this.form = form}
                        onFinish={() => this.setState({pageNum: 1}, () => this.handleSubmit())}
                    >
                        <FormRow>
                            ${queries.map(item => `<FormElement
                                {...formProps}
                                ${item.type !== 'input' ? `type="${item.type}"` : DELETE_THIS_LINE}
                                label="${item.label}"
                                name="${item.field}"
                                ${WITH_OPTIONS_TYPE.includes(item.type) ? `options={[
                                    {value: '1', label: '选项1'},
                                    {value: '2', label: '选项2'},
                                ]}` : DELETE_THIS_LINE}
                            />`).join('\n                            ')}
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button onClick={() => this.form.resetFields()}>重置</Button>
                                ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `this.setState({visible: true, id: null})` : `this.props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                                ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={this.handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                                ${tools.filter(item => !['添加', '删除'].includes(item.text)).length ? tools.filter(item => !['添加', '删除'].includes(item.text)).map(item => `<Button type="primary" onClick={this.${item.handle}}>${item.text}</Button>`).join('\n                             ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>` : DELETE_THIS_LINE}
                ${(!queries && tools) ? `<ToolBar>
                    ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `this.setState({visible: true, id: null})` : `this.props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                    ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={this.handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                    ${tools.filter(item => !['添加', '删除'].includes(item.text)).length ? tools.filter(item => !['添加', '删除'].includes(item.text)).map(item => `<Button type="primary" onClick={this.${item.handle}}>${item.text}</Button>`).join('\n                     ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
                </ToolBar>` : DELETE_THIS_LINE}
                <Table
                    ${table.serialNumber ? 'serialNumber' : DELETE_THIS_LINE}
                    ${table.selectable ? `rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}` : DELETE_THIS_LINE}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    ${table.serialNumber && table.pagination ? 'pageNum={pageNum}' : DELETE_THIS_LINE}
                    ${table.serialNumber && table.pagination ? 'pageSize={pageSize}' : DELETE_THIS_LINE}
                />
                ${table.pagination ? `<Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({pageNum}, () => this.handleSubmit())}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, () => this.handleSubmit())}
                />` : DELETE_THIS_LINE}
                ${isModalEdit ? `<EditModal
                    visible={visible}
                    id={id}
                    isEdit={id !== null}
                    onOk={() => this.setState({visible: false}, () => this.handleSubmit())}
                    onCancel={() => this.setState({visible: false})}
                />` : DELETE_THIS_LINE}
            </PageContent>
        );
    }
}
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
