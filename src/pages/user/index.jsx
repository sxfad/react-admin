import {useState} from 'react';
import {Button, Form, Space} from 'antd';
import {
    PageContent,
    QueryBar,
    FormItem,
    Table,
    Pagination,
    Operator,
    ToolBar,
} from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import options from 'src/options';
import EditModal from './EditModal';

export default config({
    path: '/users',
})(function User(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [visible, setVisible] = useState(false);
    const [record, setRecord] = useState(null);
    const [form] = Form.useForm();

    const params = {
        ...conditions,
        pageNum,
        pageSize,
    };

    // 获取列表
    const {
        data: {
            dataSource,
            total,
        } = {},
    } = props.ajax.useGet('/users', params, [conditions, pageNum, pageSize], {
        setLoading,
        formatResult: res => {
            return {
                dataSource: res?.list || [],
                total: res.total || 0,
            };
        },
    });

    // 删除
    const {run: deleteRecord} = props.ajax.useDel('/users/:id', null, {setLoading, successTip: '删除成功！'});

    const columns = [
        {title: '账号', dataIndex: 'account'},
        {title: '姓名', dataIndex: 'name'},
        {title: '启用', dataIndex: 'enabled', render: value => options.enabled.getTag(!!value)},
        {title: '手机号', dataIndex: 'mobile'},
        {title: '邮箱', dataIndex: 'email'},
        {
            title: '操作',
            key: 'operator',
            width: 250,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '查看',
                        onClick: () => setRecord({...record, isDetail: true}) || setVisible(true),
                    },
                    {
                        label: '修改',
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

                return (<Operator items={items}/>);
            },
        },
    ];

    async function handleDelete(id) {
        await deleteRecord(id);
        // 触发列表更新
        setConditions({...conditions});
    }

    const queryItem = {
        style: {width: 200},
    };

    return (
        <PageContent loading={loading}>
            <QueryBar>
                <Form
                    name="user"
                    layout="inline"
                    form={form}
                    onFinish={values => setPageNum(1) || setConditions(values)}
                >
                    <FormItem
                        {...queryItem}
                        label="账号"
                        name="account"
                    />
                    <FormItem
                        {...queryItem}
                        label="姓名"
                        name="name"
                    />
                    <FormItem
                        {...queryItem}
                        label="手机号"
                        name="mobile"
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
                <Button type="primary" onClick={() => setRecord(null) || setVisible(true)}>添加</Button>
            </ToolBar>
            <Table
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={pageSize => setPageNum(1) || setPageSize(pageSize)}
            />
            <EditModal
                visible={visible}
                record={record}
                isEdit={!!record}
                onOk={() => setVisible(false) || setConditions({...conditions})}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
