import {useCallback, useState, useEffect} from 'react';
import {Button, Form, Space} from 'antd';
import {PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import {WITH_SYSTEMS} from 'src/config';
import EditModal from './EditModal';
import options from 'src/options';

export default config({
    path: '/roles',
})(function Role(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [record, setRecord] = useState(null);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    let columns = [
        {title: '角色名称', dataIndex: 'name'},
        {title: '启用', dataIndex: 'enabled', render: (value) => options.enabled.getTag(!!value)},
        {title: '备注', dataIndex: 'remark'},
        {
            title: '操作',
            dataIndex: 'operator',
            width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除「${name}」吗？`,
                            onConfirm: () => handleDelete(id),
                        },
                    },
                ];
                return <Operator items={items} />;
            },
        },
    ];
    if (WITH_SYSTEMS) {
        columns = [{title: '归属系统', dataIndex: 'systemName'}, ...columns];
    }

    // 查询
    const handleSearch = useCallback(
        async (options = {}) => {
            const values = await form.validateFields();
            const params = {
                ...values,
                pageNum: options.pageNum || pageNum,
                pageSize: options.pageSize || pageSize,
            };
            const res = await props.ajax.get('/role/queryRoleByPage', params, {setLoading});
            const dataSource = (res?.content || []).filter((item) => item.type === 3);
            const total = res?.totalElements || 0;
            setDataSource(dataSource);
            setTotal(total);
        },
        [form, pageNum, pageSize, props.ajax],
    );

    // 删除
    const handleDelete = useCallback(
        async (id) => {
            await props.ajax.del(`/role/${id}`, null, {setLoading, successTip: '删除成功！'});
            await handleSearch();
        },
        [handleSearch, props.ajax],
    );

    // 初始化查询
    useEffect(() => {
        (async () => {
            await handleSearch({pageNum: 1});
        })();
        // eslint-disable-next-line
    }, []);

    const layout = {
        wrapperCol: {style: {width: 200}},
    };

    return (
        <PageContent loading={loading}>
            <QueryBar>
                <Form
                    name="role"
                    layout="inline"
                    form={form}
                    onFinish={async () => {
                        setPageNum(1);
                        await handleSearch({pageNum: 1});
                    }}
                >
                    <FormItem {...layout} label="角色名称" name="name" />
                    <FormItem>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button htmlType="reset">重置</Button>
                        </Space>
                    </FormItem>
                </Form>
            </QueryBar>
            <ToolBar>
                <Button
                    type="primary"
                    onClick={() => {
                        setRecord(null);
                        setVisible(true);
                    }}
                >
                    添加
                </Button>
            </ToolBar>
            <Table fitHeight dataSource={dataSource} columns={columns} rowKey="id" />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={async (pageNum) => {
                    setPageNum(pageNum);
                    await handleSearch({pageNum});
                }}
                onPageSizeChange={async (pageSize) => {
                    setPageNum(1);
                    setPageSize(pageSize);
                    await handleSearch({pageNum: 1, pageSize});
                }}
            />
            <EditModal
                visible={visible}
                isEdit={!!record}
                record={record}
                onOk={async () => {
                    setVisible(false);
                    await handleSearch();
                }}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
