import React, {useEffect, useState} from 'react';
import {Button, Form} from 'antd';

import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {
    FormElement,
    FormRow,
    Operator,
    Pagination,
    QueryBar,
    Table,
} from 'src/library/components';
import batchDeleteConfirm from 'src/components/batch-delete-confirm';

import EditModal from './EditModalHooks';

export default config({
    path: '/hook/users',
    title: '用户管理(Hooks)',
})(props => {
    // 数据定义
    const [loading, setLoading] = useState(false);
    const [condition, setCondition] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [deleting, setDeleting] = useState(false);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        {title: '用户名', dataIndex: 'name', width: 200},
        {title: '年龄', dataIndex: 'age', width: 200},
        {title: '工作', dataIndex: 'job', width: 200},
        {title: '职位', dataIndex: 'position', width: 200},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
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

    // 函数定义
    async function handleSearch() {
        if (loading) return;
        const params = {
            ...condition,
            pageNum,
            pageSize,
        };

        console.log(params);
        setLoading(true);
        const res = await props.ajax.get('/mock/users', params);

        setDataSource(res?.list || []);
        setTotal(res?.total || 0);

        setLoading(false);
    }

    async function handleDelete(id) {
        if (deleting) return;

        setDeleting(true);
        await props.ajax.del(`/mock/users/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'});
        form.submit();
        setDeleting(false);
    }

    async function handleBatchDelete() {
        if (deleting) return;
        const ok = await batchDeleteConfirm(selectedRowKeys.length);

        if (!ok) return;

        setDeleting(true);
        const {$error} = await props.ajax.del('/mock/users', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'});
        setDeleting(false);

        if ($error) return;

        setSelectedRowKeys([]);
        form.submit();
    }

    // effect 定义
    // condition pageNum pageSize 改变触发查询
    useEffect(() => {
        handleSearch();
    }, [
        condition,
        pageNum,
        pageSize,
    ]);

    // jsx 用到的数据
    const formProps = {width: 200};
    const disabledDelete = !selectedRowKeys?.length;
    return (
        <PageContent>
            <QueryBar>
                <Form form={form} onFinish={setCondition}>
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            name="name"
                        />
                        <FormElement
                            {...formProps}
                            type="select"
                            label="职位"
                            name="job"
                            options={[
                                {value: 1, label: 1},
                                {value: 2, label: 2},
                            ]}
                        />
                        <FormElement layout>
                            <Button type="primary" htmlType="submit">提交</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" onClick={() => setVisible(true) || setId(null)}>添加</Button>
                            <Button danger disabled={disabledDelete || loading} onClick={handleBatchDelete}>删除</Button>
                        </FormElement>
                    </FormRow>
                </Form>
            </QueryBar>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={setPageSize}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={() => setVisible(false) || form.submit()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
