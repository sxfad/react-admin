import React, {useEffect, useState} from 'react';
import {
    Button,
    Form,
    Space,
} from 'antd';
import {
    PageContent,
    batchDeleteConfirm,
    Operator,
    Pagination,
    QueryBar,
    Table,
    FormItem,
} from 'ra-lib';
import config from 'src/commons/config-hoc';
import EditModal from './EditModal';

export default config({
    path: '/users',
})((props) => {
    // 数据定义
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState(0);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [form] = Form.useForm();

    // 请求相关定义 只是定义，不会触发请求，调用相关函数，才会触发请求
    const [loading, fetchUsers] = props.ajax.useGet('/mock/users');
    const [deleting, deleteUsers] = props.ajax.useDel('/mock/users/:id', {successTip: '删除成功！', errorTip: '删除失败！'});
    const [deletingOne, deleteUser] = props.ajax.useDel('/mock/users/:id', {successTip: '删除成功！', errorTip: '删除失败！'});

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

        console.log('params:', params);
        const res = await fetchUsers(params);
        console.log('res:', res);

        setDataSource(res?.list || []);
        setTotal(res?.total || 0);
    }

    async function handleDelete(id) {
        if (deletingOne) return;

        await deleteUser(id);
        await handleSearch();
    }

    async function handleBatchDelete() {
        if (deleting) return;

        await batchDeleteConfirm(selectedRowKeys.length);

        await deleteUsers({ids: selectedRowKeys});
        setSelectedRowKeys([]);
        await handleSearch();
    }

    // 组件初始化完成之后，进行一次查询
    useEffect(() => {
        (async () => {
            await handleSearch({pageNum, pageSize});
        })();
    }, [pageNum, pageSize]);

    const formLayout = {
        style: {width: 200},
    };

    const pageLoading = loading || deleting || deletingOne;
    const disabledDelete = !selectedRowKeys?.length || pageLoading;

    return (
        <PageContent loading={pageLoading}>
            <QueryBar>
                <Form
                    layout="inline"
                    form={form}
                    onFinish={() => handleSearch({pageNum: 1})}
                >
                    <FormItem
                        {...formLayout}
                        label="名称"
                        name="name"
                    />
                    <FormItem
                        {...formLayout}
                        label="职位"
                        name="job"
                        options={[
                            {value: 1, label: 1},
                            {value: 2, label: 2},
                        ]}
                        onChange={() => handleSearch({pageNum: 1})}
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                            <Button type="primary" onClick={() => setVisible(true) || setId(null)}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={handleBatchDelete}>删除</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
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
                onPageNumChange={pageNum => setPageNum(pageNum)}
                onPageSizeChange={pageSize => {
                    setPageNum(1);
                    setPageSize(pageSize);
                }}
            />
            <EditModal
                visible={visible}
                id={id}
                isEdit={id !== null}
                onOk={async () => {
                    setVisible(false);
                    await handleSearch({pageNum: 1});
                }}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
