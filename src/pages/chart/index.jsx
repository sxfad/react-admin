import React, {useEffect, useState} from 'react';
import {Button, Form, } from 'antd';

import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {useGet, useDel} from 'src/commons/ajax';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
    Pagination,
} from 'src/library/components';
import batchDeleteConfirm from 'src/components/batch-delete-confirm';

import EditModal from './EditModal';

export default config({
    path: '/charts',
})(() => {
    const [{condition, pageSize, pageNum}, setCondition] = useState({condition: {}, pageSize: 20, pageNum: 1});
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [form] = Form.useForm();

    const [loading, fetchCharts] = useGet('/charts');
    const [deleting, deleteCharts] = useDel('/charts', {successTip: '删除成功！', errorTip: '删除失败！'});
    const [deletingOne, deleteChart] = useDel('/charts/{id}', {successTip: '删除成功！', errorTip: '删除失败！'});

    const columns = [
        {title: '图标标题', dataIndex: 'title', width: 200},
        {title: 'type', dataIndex: 'type', width: 200},
        {title: '描述', dataIndex: 'description', width: 200},
        {title: '消息标识', dataIndex: 'messageToken', width: 200},
        {title: '纵轴显示标签个数', dataIndex: 'valueTickCount', width: 200},
        {title: '横轴系显示标签个数', dataIndex: 'labelTickCount', width: 200},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
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

                return <Operator items={items}/>
            },
        },
    ];

    async function handleSearch() {
        if (loading) return;
        const params = {
            ...condition,
            pageNum,
            pageSize,
        };

        const res = await fetchCharts(params);

        setDataSource(res?.list || []);
        setTotal(res?.total || 0);
    }

    async function handleDelete(id) {
        if (deletingOne) return;

        await deleteChart(id);
        await handleSearch();
    }

    async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await deleteCharts({ids: selectedRowKeys});
        setSelectedRowKeys([]);
        await handleSearch();
    }

    useEffect(() => {
        handleSearch();
    }, [
        condition,
        pageNum,
        pageSize,
    ]);

    const formProps = {width: 200};
    const pageLoading = loading || deleting || deletingOne;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <QueryBar>
                <Form
                    name="chart-query"
                    form={form}
                    onFinish={condition => setCondition({condition, pageSize, pageNum: 1})}
                >
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="图标标题"
                            name="title"
                        />
                            <FormElement
                            {...formProps}
                            label="type"
                            name="type"
                        />
                        <FormElement layout>
                            <Button type="primary" htmlType="submit">提交</Button>
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
                onPageNumChange={pageNum => setCondition({condition, pageSize, pageNum})}
                onPageSizeChange={pageSize => setCondition({condition, pageSize, pageNum: 1})}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || handleSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
