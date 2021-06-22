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
    config,
    IS_MOBILE,
} from '@ra-lib/admin';
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
    } = props.ajax.useGet('/user/queryUsersByPage', params, [conditions, pageNum, pageSize], {
        setLoading,
        formatResult: res => {
            return {
                dataSource: res?.content || [],
                total: res.totalElements || 0,
            };
        },
    });

    // 删除
    const {run: deleteRecord} = props.ajax.useDel('/user/:id', null, {setLoading, successTip: '删除成功！'});

    const columns = [
        {title: '账号', dataIndex: 'account'},
        {title: '姓名', dataIndex: 'name'},
        {title: '启用', dataIndex: 'enabled', render: value => options.enabled.getTag(!!value)},
        {title: '手机号', dataIndex: 'mobile'},
        {title: '邮箱', dataIndex: 'email'},
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
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
            <QueryBar showCollapsedBar={IS_MOBILE}>
                {(collapsed) => {
                    const hidden = IS_MOBILE && collapsed;
                    return (
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
                                hidden={hidden}
                                {...queryItem}
                                label="姓名"
                                name="name"
                            />
                            <FormItem
                                hidden={hidden}
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
                    );
                }}
            </QueryBar>
            <ToolBar>
                <Button type="primary" onClick={() => setRecord(null) || setVisible(true)}>添加</Button>
            </ToolBar>
            <Table
                serialNumber
                pageNum={pageNum}
                pageSize={pageSize}
                fitHeight={!IS_MOBILE}
                dataSource={dataSource}
                columns={columns}
                rowKey="id"
                scroll={IS_MOBILE ? {x: 1000} : undefined}
            />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={pageSize => setPageNum(1) || setPageSize(pageSize)}
            />
            <EditModal
                fullScreen={IS_MOBILE}
                width={IS_MOBILE ? '100%' : '70%'}
                visible={visible}
                record={record}
                isEdit={!!record}
                onOk={() => setVisible(false) || setConditions({...conditions})}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
