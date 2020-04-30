import React, {Component} from 'react';
import {Button, Form, Row, Col} from 'antd';
import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import MenuSelect from 'src/pages/menu-permission/MenuSelect';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
} from 'src/library/components';
import EditModal from './EditModal';
import './style.less';

@config({
    path: '/roles',
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
        loadingRoleMenu: false, // 查询角色权限 loading标识
        selectedKeys: [],   // 角色对应的菜单
        selectedRoleId: undefined, // 当前选中角色
    };

    columns = [
        {title: '角色名称', dataIndex: 'name', width: 150},
        {title: '描述', dataIndex: 'description'},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '修改',
                        onClick: (e) => {
                            e.stopPropagation();
                            this.setState({visible: true, id});
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: (e) => {
                                e.stopPropagation();
                                this.handleDelete(id);
                            },
                        },
                    },
                ];

                return <Operator items={items}/>;
            },
        },
    ];

    componentDidMount() {
        this.handleSubmit();
    }

    handleSubmit = (values) => {
        if (this.state.loading) return;
        const params = {
            ...values,
        };

        // 一般系统中，角色不会太多，不做分页查询了
        this.setState({loading: true});
        this.props.ajax.get('/mock/role', params)
            .then(res => {
                const dataSource = res || [];

                this.setState({dataSource});

                // 查询之后，默认选中第一个角色
                if (dataSource[0]) this.handleRowClick(dataSource[0]);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({deleting: true});
        this.props.ajax.del(`/mock/roles/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
            .then(() => this.form.submit())
            .finally(() => this.setState({deleting: false}));
    };

    handleRowClick = (record) => {
        const {id} = record;
        this.setState({selectedRoleId: id, selectedKeys: []});
        // 根据id 获取 role对应的菜单权限
        const params = {roleId: id};
        this.setState({loadingRoleMenu: true});
        this.props.ajax.get('/mock/roles/menus', params)
            .then(res => {
                this.setState({selectedKeys: res});
            })
            .finally(() => this.setState({loadingRoleMenu: false}));
    };

    handleSaveRoleMenu = () => {
        const {selectedKeys} = this.state;

        const params = {ids: selectedKeys};
        this.setState({loading: true});
        this.props.ajax.post('/mock/roles/menus', params, {successTip: '保存角色权限成功！'})
            .then(res => {

            })
            .finally(() => this.setState({loading: false}));
    };

    render() {
        const {
            loading,
            dataSource,
            visible,
            id,
            selectedRoleId,
            selectedKeys,
            loadingRoleMenu,
        } = this.state;

        const {form} = this.props;
        const formProps = {
            form,
            width: 220,
            style: {paddingLeft: 16},
        };

        const selectedRoleName = dataSource.find(item => item.id === selectedRoleId)?.name;

        return (
            <PageContent styleName="root" loading={loading || loadingRoleMenu}>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={form => this.form = form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="角色名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">查询</Button>
                                <Button onClick={() => this.form.resetFields()}>重置</Button>
                                <Button type="primary" onClick={() => this.setState({visible: true, id: null})}>添加</Button>
                            </FormElement>
                            <div styleName="role-menu-tip">
                                {selectedRoleName ? <span>当前角色权限：「{selectedRoleName}」</span> : <span>请在左侧列表中选择一个角色！</span>}
                                <Button disabled={!selectedRoleName} type="primary" onClick={this.handleSaveRoleMenu}>保存权限</Button>
                            </div>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Row>
                    <Col span={14}>
                        <Table
                            rowClassName={record => {
                                if (record.id === selectedRoleId) return 'role-table selected';

                                return 'role-table';
                            }}
                            serialNumber
                            columns={this.columns}
                            dataSource={dataSource}
                            rowKey="id"
                            onRow={(record, index) => {
                                return {
                                    onClick: () => this.handleRowClick(record, index),
                                };
                            }}
                        />
                    </Col>
                    <Col span={10}>
                        <MenuSelect
                            value={selectedKeys}
                            onChange={selectedKeys => this.setState({selectedKeys})}
                        />
                    </Col>
                </Row>
                <EditModal
                    visible={visible}
                    id={id}
                    isEdit={id !== null}
                    onOk={() => this.setState({visible: false}, this.form.submit)}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
