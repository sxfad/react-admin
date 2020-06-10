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

    return `import React, {useEffect, useState} from 'react';
${tools || queries || hasBatchDelete ? `import {${(queries || tools) ? 'Button, ' : ''}${queries ? 'Form' : ''}} from 'antd';` : DELETE_THIS_LINE}
${columns.find(renderTime) ? `import moment from 'moment';` : DELETE_THIS_LINE}

import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {useGet${hasDelete || hasBatchDelete ? ', useDel' : ''}} from 'src/commons/ajax';
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

export default config({
    path: '${base.path}',
    ${isPageEdit ? 'router: true,' : DELETE_THIS_LINE}
})((${isPageEdit ? 'props' : ''}) => {
    ${queries || table.pagination ? `const [{${queries ? 'condition, ' : ''}${table.pagination ? 'pageSize, pageNum' : ''}}, setCondition] = useState({${queries ? 'condition: {}, ' : ''}${table.pagination ? 'pageSize: 20, pageNum: 1' : ''}});` : DELETE_THIS_LINE}
    const [dataSource, setDataSource] = useState([]);
    ${table.selectable ? 'const [selectedRowKeys, setSelectedRowKeys] = useState([]);' : DELETE_THIS_LINE}
    ${table.pagination ? 'const [total, setTotal] = useState(0);' : DELETE_THIS_LINE}
    ${isModalEdit ? 'const [visible, setVisible] = useState(false);' : DELETE_THIS_LINE}
    ${isModalEdit ? 'const [id, setId] = useState(null);' : DELETE_THIS_LINE}
    ${queries ? 'const [form] = Form.useForm();' : DELETE_THIS_LINE}

    const [loading, fetch${base.ModuleNames}] = useGet('${base.ajax.search.url}');
    ${hasDelete ? `const [deleting, delete${base.ModuleNames}] = useDel('${base.ajax.batchDelete.url}', {successTip: '删除成功！', errorTip: '删除失败！'});` : DELETE_THIS_LINE}
    ${hasBatchDelete ? `const [deletingOne, delete${base.ModuleName}] = useDel('${base.ajax.delete.url}', {successTip: '删除成功！', errorTip: '删除失败！'});` : DELETE_THIS_LINE}

    const columns = [
        ${columns.map(item => `{title: '${item.title}', dataIndex: '${item.dataIndex}', width: 200${renderTime(item)}},`).join('\n        ')}
        ${operators ? `{
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    ${operatorEdit ? `{
                        label: '修改',
                        ${operatorEdit.iconMode ? `icon: '${operatorEdit.icon}',` : DELETE_THIS_LINE}
                        ${isModalEdit ? 'onClick: () => setVisible(true) || setId(id),' : DELETE_THIS_LINE}
                        ${isPageEdit ? `onClick: () => props.history.push(\`${base.path}/_/edit/\${id}\`),` : DELETE_THIS_LINE}
                    },` : DELETE_THIS_LINE}
                    ${operatorDelete ? `{
                        label: '删除',
                        ${operatorDelete.iconMode ? `icon: '${operatorDelete.icon}',` : DELETE_THIS_LINE}
                        color: 'red',
                        confirm: {
                            title: \`您确定删除"\${name}"?\`,
                            onConfirm: () => handleDelete(id),
                        },
                    },` : DELETE_THIS_LINE}
                    ${operators.filter(item => !['修改', '删除'].includes(item.text)).map(item => `{
                        label: '${item.text}',
                        ${item.iconMode ? `icon: '${item.icon}',` : DELETE_THIS_LINE}
                        onClick: ${item.handle},
                    },`).join('\n                        ')}
                ];

                return <Operator items={items}/>
            },
        },` : DELETE_THIS_LINE}
    ];

    async function handleSearch() {
        if (loading) return;
        const params = {
            ${queries ? '...condition,' : DELETE_THIS_LINE}
            ${table.pagination ? `pageNum,
            pageSize,` : DELETE_THIS_LINE}
        };

        const res = await fetch${base.ModuleNames}(params);

        setDataSource(res?.list || []);
        ${table.pagination ? 'setTotal(res?.total || 0);' : DELETE_THIS_LINE}
    }

    ${hasDelete ? `async function handleDelete(id) {
        if (deletingOne) return;

        await delete${base.ModuleName}(id);
        await handleSearch();
    }` : DELETE_THIS_LINE}

    ${hasBatchDelete ? `async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await delete${base.ModuleNames}({ids: selectedRowKeys});
        setSelectedRowKeys([]);
        await handleSearch();
    }` : DELETE_THIS_LINE}

    ${handles ? handles.map(item => `const function ${item}() {
        // TODO
    };
    `).join('\n    ') : DELETE_THIS_LINE}
    useEffect(() => {
        handleSearch();
    }, [
        ${queries ? 'condition,' : DELETE_THIS_LINE}
        ${table.pagination ? `pageNum,
        pageSize,` : DELETE_THIS_LINE}
    ]);

    ${queries ? 'const formProps = {width: 200};' : DELETE_THIS_LINE}
    const pageLoading = loading${hasBatchDelete ? ' || deleting' : null}${hasDelete ? ' || deletingOne' : ''};
    ${hasBatchDelete ? 'const disabledDelete = !selectedRowKeys?.length || pageLoading;' : DELETE_THIS_LINE}

    return (
        <PageContent loading={pageLoading}>
            ${queries ? `<QueryBar>
                <Form
                    name="${base.moduleName}-query"
                    form={form}
                    onFinish={condition => setCondition({condition${table.pagination ? ', pageSize, pageNum: 1' : ''}})}
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
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `setVisible(true) || setId(null)` : `props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                            ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                            ${tools.filter(item => !['添加', '删除'].includes(item.text)).length ? tools.filter(item => !['添加', '删除'].includes(item.text)).map(item => `<Button type="primary" onClick={${item.handle}}>${item.text}</Button>`).join('\n                         ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
                        </FormElement>
                    </FormRow>
                </Form>
            </QueryBar>` : DELETE_THIS_LINE}
            ${(!queries && tools) ? `<ToolBar>
                ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `setVisible(true) || setId(null)` : `props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                ${tools.filter(item => !['添加', '删除'].includes(item.text)).length ? tools.filter(item => !['添加', '删除'].includes(item.text)).map(item => `<Button type="primary" onClick={${item.handle}}>${item.text}</Button>`).join('\n                 ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
            </ToolBar>` : DELETE_THIS_LINE}
            <Table
                ${table.serialNumber ? 'serialNumber' : DELETE_THIS_LINE}
                ${table.selectable ? `rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}` : DELETE_THIS_LINE}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                ${table.serialNumber && table.pagination ? 'pageNum={pageNum}' : DELETE_THIS_LINE}
                ${table.serialNumber && table.pagination ? 'pageSize={pageSize}' : DELETE_THIS_LINE}
            />
            ${table.pagination ? `<Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={pageNum => setCondition({${queries ? 'condition, ' : ''}pageSize, pageNum})}
                onPageSizeChange={pageSize => setCondition({${queries ? 'condition, ' : ''}pageSize, pageNum: 1})}
            />` : DELETE_THIS_LINE}
            ${isModalEdit ? `<EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || handleSearch()}
                onCancel={() => setVisible(false)}
            />` : DELETE_THIS_LINE}
        </PageContent>
    );
});
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
