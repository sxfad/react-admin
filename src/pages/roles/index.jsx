import React, {Component} from 'react';
import {Table} from 'antd';
import PageContent from '@/layouts/page-content';
import {Operator, ToolBar} from "@/library/antd";
import config from '@/commons/config-hoc';
import RoleEdit from './RoleEdit';

@config({
    path: '/roles',
})
export default class RoleList extends Component {
    state = {
        roleId: void 0,
        visible: false,
        dataSource: [],     // 表格数据
    };

    columns = [
        {title: '角色名称', dataIndex: 'name', key: 'name'},
        {title: '角色描述', dataIndex: 'description', key: 'description'},
        {
            title: '操作', dataIndex: 'operator', key: 'operator',
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => this.handleEdit(id),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleDelete(id),
                        },
                    }
                ];

                return <Operator items={items}/>
            },
        }
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = () => {
        const pageNum = 1;
        const pageSize = 20;
        const dataSource = [];
        for (let i = 0; i < pageSize; i++) {
            const id = pageSize * (pageNum - 1) + i + 1;
            dataSource.push({id: `${id}`, name: `管理员${id}`, description: '角色描述'});
        }

        this.setState({dataSource});
    };


    handleAdd = () => {
        this.setState({roleId: void 0, visible: true});
    };

    handleDelete = (id) => {
        // TODO
    };

    handleEdit = (roleId) => {
        this.setState({roleId, visible: true});
    };

    render() {
        const {
            dataSource,
            visible,
            roleId,
        } = this.state;
        console.log('render roles');
        return (
            <PageContent>
                <ToolBar
                    items={[
                        {type: 'primary', text: '添加角色', icon: 'plus', onClick: this.handleAdd}
                    ]}
                />

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />
                <RoleEdit
                    roleId={roleId}
                    visible={visible}
                    onOk={() => this.setState({visible: false})}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
