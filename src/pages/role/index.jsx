import { useCallback, useMemo, useState } from 'react';
import { Button, Form, Space } from 'antd';
import { PageContent, QueryBar, FormItem, Table, Pagination, Operator, ToolBar } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';
import EditModal from './EditModal';
import options from 'src/options';
import s from './style.less';

export default config({
    path: '/roles',
})(function Role(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [record, setRecord] = useState(null);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();

    const params = useMemo(() => {
        return {
            ...conditions,
            pageNum,
            pageSize,
        };
    }, [conditions, pageNum, pageSize]);

    // 使用现有查询条件，重新发起请求
    const refreshSearch = useCallback(() => setConditions(form.getFieldsValue()), [form]);
    // 获取列表
    const { data: { dataSource, total } = {} } = props.ajax.useGet('/role/queryRoleByPage', params, [params], {
        setLoading,
        // mountFire: false, // 初始化不查询
        formatResult: (res) => {
            return {
                // 只有自定义角色显示
                dataSource: (res?.content || []).filter((item) => item.type === 3),
                total: res?.totalElements || 0,
            };
        },
    });

    // 删除
    const { run: deleteRole } = props.ajax.useDel('/role/:id', null, { setLoading, successTip: '删除成功！' });

    let columns = [
        { title: '角色名称', dataIndex: 'name' },
        { title: '启用', dataIndex: 'enabled', render: (value) => options.enabled.getTag(!!value) },
        { title: '备注', dataIndex: 'remark' },
        {
            title: '操作',
            dataIndex: 'operator',
            width: 100,
            render: (value, record) => {
                const { id, name } = record;
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
        columns = [{ title: '归属系统', dataIndex: 'systemName' }, ...columns];
    }

    const handleDelete = useCallback(
        async (id) => {
            await deleteRole(id);

            // 触发查询
            refreshSearch();
        },
        [deleteRole, refreshSearch],
    );

    const layout = {
        wrapperCol: { style: { width: 200 } },
    };

    return (
        <PageContent fitHeight className={s.root} loading={loading}>
            <QueryBar>
                <Form
                    name="role"
                    layout="inline"
                    form={form}
                    onFinish={(values) => {
                        setPageNum(1);
                        setConditions(values);
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
                <Button type="primary" onClick={() => setRecord(null) || setVisible(true)}>
                    添加
                </Button>
            </ToolBar>
            <Table fitHeight dataSource={dataSource} columns={columns} rowKey="id" />
            <Pagination
                total={total}
                pageNum={pageNum}
                pageSize={pageSize}
                onPageNumChange={setPageNum}
                onPageSizeChange={(pageSize) => setPageNum(1) || setPageSize(pageSize)}
            />
            <EditModal
                visible={visible}
                isEdit={!!record}
                record={record}
                onOk={() => setVisible(false) || refreshSearch()}
                onCancel={() => setVisible(false)}
            />
        </PageContent>
    );
});
