import {useState} from 'react';
import config from 'src/commons/config-hoc';
import {Button, Form, Space} from 'antd';
import {
    PageContent,
    QueryBar,
    FormItem,
    Table,
    Pagination,
    Operator,
    ToolBar,
} from '@ra-lib/components';
import {IS_MOBILE} from 'src/config';
import EditModal from './EditModal';

export default config({
    path: '/users',
})(function Role(props) {
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

    // 获取角色列表
    const {
        data: {
            dataSource,
            total,
        } = {},
    } = props.ajax.useGet('/user/list', params, [conditions, pageNum, pageSize], {
        setLoading,
        // mountFire: false, // 初始化不查询
        formatResult: res => {
            return {
                dataSource: res?.content || [],
                total: window.parseInt(res?.totalElements, 10) || 0,
            };
        },
    });

    const columns = [
        {title: '姓名', dataIndex: 'realName'},
        {title: '手机号', dataIndex: 'phone'},
        {title: '邮箱', dataIndex: 'email'},
        {
            title: '状态', dataIndex: 'status',
            render: (text, record) => {
                const {status} = record;
                if (status === 'START') return '可用';
                return '停用';
            },
        },
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const items = [
                    {
                        label: '查看',
                        onClick: () => setRecord({...record, isDetail: true}) || setVisible(true),
                    },
                    {
                        label: '修改',
                        onClick: () => setRecord(record) || setVisible(true),
                    },
                ];

                return (<Operator items={items}/>);
            },
        },
    ];

    const queryItem = {
        style: {width: 200},
    };

    return (
        <PageContent loading={loading}>
            <QueryBar showCollapsedBar={IS_MOBILE}>
                {(collapsed) => {
                    // const hidden = IS_MOBILE && collapsed;
                    return (
                        <Form
                            name="user"
                            layout="inline"
                            form={form}
                            onFinish={values => setPageNum(1) || setConditions(values)}
                        >
                            <FormItem
                                {...queryItem}
                                label="姓名"
                                name="realName"
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
                pagination={false}
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
