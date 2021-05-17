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
import RoleEdit from './Edit';
import MenuSelect from 'src/pages/menus/MenuSelect';
import styles from './style.less';

export default config({
    path: '/roles',
})(function Role(props) {
    const [loading, setLoading] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [conditions, setConditions] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedMenuKeys, setSelectedMenuKeys] = useState([]);
    const [id, setId] = useState(null);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedRole, setSelectedRole] = useState(null);

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
    } = props.ajax.useGet('/roles', params, [conditions, pageNum, pageSize], {
        setLoading,
        // mountFire: false, // 初始化不查询
        formatResult: res => {
            return {
                dataSource: res?.list || [],
                total: res?.total || 0,
            };
        },
    });

    // 获取角色菜单
    const {loading: menuLoading, run: fetchRoleMenus} = props.ajax.useGet('/roleMenus');

    // 批量删除
    const {run: batchDelete} = props.ajax.useDel('/roles', null, {setLoading, successTip: '批量删除成功！'});

    const columns = [
        {title: '角色名', dataIndex: 'name', width: 150},
        {title: '描述', dataIndex: 'description'},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (text, record) => {
                const {id} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => setId(id) || setVisible(true),
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

    async function handleClick(record) {
        setSelectedRole(record);
        const res = await fetchRoleMenus({roleId: record.id});
        setSelectedMenuKeys(res);
    }

    const layout = {
        wrapperCol: {style: {width: 200}},
    };
    const disabled = !selectedRowKeys?.length;

    return (
        <div className={styles.root}>
            <PageContent fitHeight className={styles.role} loading={loading}>
                <QueryBar>
                    <Form
                        name="user"
                        layout="inline"
                        form={form}
                        onFinish={values => setPageNum(1) || setConditions(values)}
                    >
                        <FormItem
                            {...layout}
                            label="角色名称"
                            name="name"
                        />
                        <FormItem>
                            <Space>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button htmlType="reset">重置</Button>
                            </Space>
                        </FormItem>
                    </Form>
                </QueryBar>
                <ToolBar>
                    <Button type="primary" onClick={() => setId(null) || setVisible(true)}>添加</Button>
                    <Button danger disabled={disabled} onClick={handleBatchDelete}>删除</Button>
                </ToolBar>
                <Table
                    rowSelection={{selectedRowKeys, onChange: setSelectedRowKeys}}
                    fitHeight
                    dataSource={dataSource}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    onRow={record => {
                        return {
                            onClick: () => handleClick(record),
                        };
                    }}
                    rowClassName={record => selectedRole?.id === record.id ? styles.selectedRow : styles.tableRow}
                />
                <Pagination
                    size="small"
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={setPageNum}
                    onPageSizeChange={pageSize => setPageNum(1) || setPageSize(pageSize)}
                />
                <RoleEdit
                    visible={visible}
                    isEdit={!!id}
                    id={id}
                    onOk={() => setVisible(false) || setConditions(form.getFieldsValue())}
                    onCancel={() => setVisible(false)}
                />
            </PageContent>
            <div className={styles.menu}>
                <Space className={styles.menuTop}>
                    <div>当前选中：{selectedRole?.name}</div>
                    <Button type="primary" disabled={!selectedRole}>保存</Button>
                </Space>
                <div className={styles.menuContent}>
                    <MenuSelect
                        loading={menuLoading}
                        fitHeight
                        offsetHeight={-8}
                        value={selectedMenuKeys}
                        onChange={selectedMenuKeys => setSelectedMenuKeys(selectedMenuKeys)}
                    />
                </div>
            </div>
        </div>
    );
});
