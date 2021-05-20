import {useState} from 'react';
import config from 'src/commons/config-hoc';
import {Button, Form, Space} from 'antd';
import {
    PageContent,
    QueryBar,
    FormItem,
    ToolBar,
    Table,
    Pagination,
    batchDeleteConfirm,
    Operator,
} from '@ra-lib/components';

export default config({
    path: '/users',
})(function Role(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const params = {
        ...conditions,
        pageNum,
        pageSize,
    };

    // 获取角色列表
    const {
        data: {
            dataSource,
            total,
        } = {},
    } = props.ajax.useGet('/users', params, [conditions, pageNum, pageSize], {
        setLoading,
        // mountFire: false, // 初始化不查询
        formatResult: res => {
            return {
                dataSource: res?.list || [],
                total: res?.total || 0,
            };
        },
    });

    // 批量删除
    const {run: batchDelete} = props.ajax.useDel('/users', null, {setLoading, successTip: '批量删除成功！'});

    const columns = [
        {title: '用户名', dataIndex: 'name', width: 100},
        {title: '年龄', dataIndex: 'age', width: 100},
        {title: '工作', dataIndex: 'job', width: 100},
        {title: '邮箱', dataIndex: 'email', width: 200},
        {title: '电话', dataIndex: 'mobile', width: 120},
        {title: '备注', dataIndex: 'remark'},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (text, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => props.history.push(`/users/${id}?name=${name}`),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: '您确定删除吗？',
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];
                return <Operator items={items}/>;
            },
        },
    ];

    async function handleDelete(id) {
        await batchDelete({ids: id}, {successTip: '删除成功！'});
    }

    async function handleBatchDelete() {
        await batchDeleteConfirm(selectedRowKeys.length);

        await batchDelete({ids: selectedRowKeys.join(',')});
    }

    const layout = {
        wrapperCol: {style: {width: 200}},
    };
    const disabled = !selectedRowKeys?.length;

    return (
        <PageContent loading={loading}>
            <QueryBar>
                <Form
                    name="user"
                    layout="inline"
                    form={form}
                    onFinish={values => setSelectedRowKeys([]) || setPageNum(1) || setConditions(values)}
                >
                    <FormItem
                        {...layout}
                        label="用户名"
                        name="name"
                    />
                    <FormItem
                        {...layout}
                        type="number"
                        label="年龄"
                        name="age"
                    />
                    <FormItem
                        {...layout}
                        type="select"
                        label="工作"
                        name="job"
                        options={[
                            {value: '1', label: 'UI设计师'},
                            {value: '2', label: '前端'},
                            {value: '3', label: '后端'},
                        ]}
                    />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <ToolBar>
                <Button type="primary" onClick={() => props.history.push('/users/:id')}>添加</Button>
                <Button danger disabled={disabled} onClick={handleBatchDelete}>删除</Button>
            </ToolBar>
            <Table
                rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                pagination={false}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={pageSize => setPageNum(1) || setPageSize(pageSize)}
            />
        </PageContent>
    );
});
