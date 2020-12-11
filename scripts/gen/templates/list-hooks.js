const DELETE_THIS_LINE = 'DELETE_THIS_LINE';
const WITH_OPTIONS_TYPE = [ 'select', 'radio-group', 'checkbox-group' ];

function renderTime(item) {
    const { title, dataIndex } = item;
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
module.exports = function(config) {
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
    const excludeHandles = [ 'handleDelete', 'handleBatchDelete' ];
    [ ...(tools || []), ...(operators || []) ].forEach(item => {
        const { handle } = item;
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

import config from 'src/commons/config-hoc';
import {
    PageContent,
    ${hasBatchDelete ? 'batchDeleteConfirm,' : DELETE_THIS_LINE}
    ${queries ? 'QueryBar,' : DELETE_THIS_LINE}
    ${(!queries && tools) ? 'ToolBar,' : DELETE_THIS_LINE}
    ${queries ? 'FormRow,' : DELETE_THIS_LINE}
    ${queries ? 'FormElement,' : DELETE_THIS_LINE}
    Table,
    ${operators ? 'Operator,' : DELETE_THIS_LINE}
    ${table.pagination ? 'Pagination,' : DELETE_THIS_LINE}
} from 'ra-lib';

${isModalEdit ? 'import EditModal from \'./EditModal\';' : DELETE_THIS_LINE}

export default config({
    path: '${base.path}',
    ${isPageEdit ? 'router: true,' : DELETE_THIS_LINE}
})((props) => {
    ${table.pagination ? `const [ pageNum, setPageNum ] = useState(1);
    const [ pageSize, setPageSize ] = useState(20);
    const [total, setTotal] = useState(0);` : DELETE_THIS_LINE}
    const [dataSource, setDataSource] = useState([]);
    ${table.selectable ? 'const [selectedRowKeys, setSelectedRowKeys] = useState([]);' : DELETE_THIS_LINE}
    ${isModalEdit ? 'const [visible, setVisible] = useState(false);' : DELETE_THIS_LINE}
    ${isModalEdit ? 'const [id, setId] = useState(null);' : DELETE_THIS_LINE}
    ${queries ? 'const [form] = Form.useForm();' : DELETE_THIS_LINE}

    const [loading, fetch${base.ModuleNames}] = props.ajax.useGet('${base.ajax.search.url}');
    ${hasDelete ? `const [deleting, delete${base.ModuleNames}] = props.ajax.useDel('${base.ajax.batchDelete.url}', {successTip: '删除成功！', errorTip: '删除失败！'});` : DELETE_THIS_LINE}
    ${hasBatchDelete ? `const [deletingOne, delete${base.ModuleName}] = props.ajax.useDel('${base.ajax.delete.url}', {successTip: '删除成功！', errorTip: '删除失败！'});` : DELETE_THIS_LINE}

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
                    ${operators.filter(item => ![ '修改', '删除' ].includes(item.text)).map(item => `{
                        label: '${item.text}',
                        ${item.iconMode ? `icon: '${item.icon}',` : DELETE_THIS_LINE}
                        onClick: ${item.handle},
                    },`).join('\n                        ')}
                ];

                return <Operator items={items}/>
            },
        },` : DELETE_THIS_LINE}
    ];

    async function handleSearch(options = {}) {
        if (loading) return;
        // 获取表单数据
        ${queries ? 'const values = form.getFieldsValue();' : DELETE_THIS_LINE}

        const params = {
            ${queries ? '...values,' : DELETE_THIS_LINE}
        };
        ${table.pagination ? `
        // 翻页信息优先从参数中获取
        params.pageNum = options.pageNum || pageNum;
        params.pageSize = options.pageSize || pageSize;`: DELETE_THIS_LINE}

        const res = await fetch${base.ModuleNames}(params);

        setDataSource(res?.list || []);
        ${table.pagination ? `
        setTotal(res?.total || 0);
        setPageNum(params.pageNum);
        setPageSize(params.pageSize);` : DELETE_THIS_LINE}
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

    // 组件初始化完成之后，进行一次查询
    useEffect(() => {
        (async () => {
            await handleSearch();
        })();
    }, []);

    ${queries ? 'const formProps = {width: 200};' : DELETE_THIS_LINE}
    const pageLoading = loading${hasBatchDelete ? ' || deleting' : null}${hasDelete ? ' || deletingOne' : ''};
    ${hasBatchDelete ? 'const disabledDelete = !selectedRowKeys?.length || pageLoading;' : DELETE_THIS_LINE}

    return (
        <PageContent loading={pageLoading}>
            ${queries ? `<QueryBar>
                <Form
                    name="${base.module_name}_query"
                    form={form}
                    onFinish={() => handleSearch({ pageNum: 1 })}
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
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `setVisible(true) || setId(null)` : `props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                            ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                            ${tools.filter(item => ![ '添加', '删除' ].includes(item.text)).length ? tools.filter(item => ![ '添加', '删除' ].includes(item.text)).map(item => `<Button type="primary" onClick={${item.handle}}>${item.text}</Button>`).join('\n                         ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
                        </FormElement>
                    </FormRow>
                </Form>
            </QueryBar>` : DELETE_THIS_LINE}
            ${(!queries && tools) ? `<ToolBar>
                ${tools ? `${tools.find(item => item.text === '添加') ? `<Button type="primary" onClick={() => ${isModalEdit ? `setVisible(true) || setId(null)` : `props.history.push('${base.path}/_/edit/:id')`}}>添加</Button>` : DELETE_THIS_LINE}
                ${tools.find(item => item.text === '删除') ? `<Button danger ${table.selectable ? 'disabled={disabledDelete} ' : ''}onClick={handleBatchDelete}>删除</Button>` : DELETE_THIS_LINE}
                ${tools.filter(item => ![ '添加', '删除' ].includes(item.text)).length ? tools.filter(item => ![ '添加', '删除' ].includes(item.text)).map(item => `<Button type="primary" onClick={${item.handle}}>${item.text}</Button>`).join('\n                 ') : DELETE_THIS_LINE}` : DELETE_THIS_LINE}
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
                onPageNumChange={pageNum => handleSearch({ pageNum })}
                onPageSizeChange={pageSize => handleSearch({ pageNum: 1, pageSize })}
            />` : DELETE_THIS_LINE}
            ${isModalEdit ? `<EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || handleSearch({ pageNum: 1 })}
                onCancel={() => setVisible(false)}
            />` : DELETE_THIS_LINE}
        </PageContent>
    );
});
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
