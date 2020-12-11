import React, { useEffect, useState } from 'react';
import { Button, Form } from 'antd';

import config from 'src/commons/config-hoc';
import {
    PageContent,
    batchDeleteConfirm,
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
    Pagination,
} from 'ra-lib';

import EditModal from './EditModal';

export default config({
    path: '/subApps',
})((props) => {
    const [ pageNum, setPageNum ] = useState(1);
    const [ pageSize, setPageSize ] = useState(20);
    const [ total, setTotal ] = useState(0);
    const [ dataSource, setDataSource ] = useState([]);
    const [ selectedRowKeys, setSelectedRowKeys ] = useState([]);
    const [ visible, setVisible ] = useState(false);
    const [ id, setId ] = useState(null);
    const [ form ] = Form.useForm();

    const [ loading, fetchSubApps ] = props.ajax.useGet('/subApps');
    const [ deleting, deleteSubApps ] = props.ajax.useDel('/subApps', { successTip: '删除成功！', errorTip: '删除失败！' });
    const [ deletingOne, deleteSubApp ] = props.ajax.useDel('/subApps/{id}', { successTip: '删除成功！', errorTip: '删除失败！' });

    const columns = [
        { title: 'entry', dataIndex: 'entry' },
        { title: 'activeRule', dataIndex: 'activeRule' },
        { title: 'name', dataIndex: 'name' },
        { title: 'description', dataIndex: 'description' },
        { title: 'side', dataIndex: 'side' },
        {
            title: '操作', dataIndex: 'operator',
            render: (value, record) => {
                const { id, name } = record;
                const items = [
                    {
                        label: '修改',
                        onClick: () => setVisible(true) || setId(id),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => handleDelete(id),
                        },
                    },

                ];

                return <Operator items={items}/>;
            },
        },
    ];

    async function handleSearch(options = {}) {
        if (loading) return;
        // 获取表单数据
        const values = form.getFieldsValue();

        const params = {
            ...values,
        };

        // 翻页信息优先从参数中获取
        params.pageNum = options.pageNum || pageNum;
        params.pageSize = options.pageSize || pageSize;

        const res = await fetchSubApps(params);

        setDataSource(res?.list || []);

        setTotal(res?.total || 0);
        setPageNum(params.pageNum);
        setPageSize(params.pageSize);
    }

    async function handleDelete(id) {
        if (deletingOne) return;

        await deleteSubApp(id);
        await handleSearch();
    }

    async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await deleteSubApps({ ids: selectedRowKeys });
        setSelectedRowKeys([]);
        await handleSearch();
    }


    // 组件初始化完成之后，进行一次查询
    useEffect(() => {
        (async () => {
            await handleSearch();
        })();
    }, []);

    const formProps = {};
    const pageLoading = loading || deleting || deletingOne;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <QueryBar>
                <Form
                    name="subApps_query"
                    form={form}
                    onFinish={() => handleSearch({ pageNum: 1 })}
                >
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="entry"
                            name="entry"
                        />
                        <FormElement
                            {...formProps}
                            label="activeRule"
                            name="activeRule"
                        />
                        <FormElement layout>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" onClick={() => setVisible(true) || setId(null)}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
                        </FormElement>
                    </FormRow>
                </Form>
            </QueryBar>
            <Table
                serialNumber
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pageNum={pageNum}
                pageSize={pageSize}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={pageNum => handleSearch({ pageNum })}
                onPageSizeChange={pageSize => handleSearch({ pageNum: 1, pageSize })}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || handleSearch({ pageNum: 1 })}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
