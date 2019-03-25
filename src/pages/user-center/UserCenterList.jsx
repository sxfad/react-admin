import React, {Component} from 'react';
import {Table} from 'antd';
import FixBottom from '@/layouts/fix-bottom';
import {
    QueryBar,
    QueryItem,
    ToolItem,
    Pagination,
    Operator,
    ToolBar,
} from "@/library/antd";
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import UserCenterEdit from './UserCenterEdit';

@config({
    path: '/user-center',
    ajax: true,
})
export default class UserCenterList extends Component {
    state = {
        loading: false,
        dataSource: [],
        total: 0,
        pageSize: 10,
        pageNum: 1,
        params: {},
        id: void 0,
        visible: false,
    };

    // TODO 查询条件
    queryItems = [
        [
            {
                type: 'input',
                field: 'inMno',
                label: '用户商编',
            },
            {
                type: 'input',
                field: 'userNo',
                label: '用户号',
            },
            {
                type: 'date-time',
                field: 'updateTime',
                label: '最后修改时间',
            },
        ],
    ];

    // TODO 顶部工具条
    toolItems = [
        {
            type: 'primary',
            text: '添加',
            icon: 'plus',
            onClick: () => {
                // TODO
            },
        },
    ];

    // TODO 底部工具条
    bottomToolItems = [
        {
            type: 'primary',
            text: '导出',
            icon: 'export',
            onClick: () => {
                // TODO
            },
        },
    ];

    columns = [
        {title: '客户号', dataIndex: 'customerNo'},
        {title: '客户名称', dataIndex: 'name'},
        {title: '状态(00', dataIndex: 'state'},
        {title: '出款开关(', dataIndex: 'wdcFlg'},
        {title: '入款开关(', dataIndex: 'payFlg'},
        {title: '创建时间', dataIndex: 'createTime'},
        {title: '最后修改时间', dataIndex: 'updateTime'},
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                const {id, customerNo} = record;
                const successTip = `删除“${customerNo}”成功！`;
                const items = [
                    {
                        label: '修改',
                        onClick: () => {
                            this.handleEdit(id);
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定要删除“${customerNo}”？`,
                            onConfirm: () => {
                                this.setState({loading: true});
                                this.props.ajax
                                    .del(`/user-center/${id}`, null, {successTip})
                                    .then(() => this.handleSearch())
                                    .finally(() => this.setState({loading: false}));
                            },
                        },
                    },
                ];

                return (<Operator items={items}/>);
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = () => {
        const {params, pageNum, pageSize} = this.state;

        this.setState({loading: true});
        this.props.ajax
            .get('/mock/user-center', {...params, pageNum, pageSize})
            .then(res => {
                console.log(res);
                if (res) {
                    const {list: dataSource, total} = res;
                    this.setState({
                        dataSource,
                        total,
                    });
                }
            })
            .finally(() => this.setState({loading: false}));
    };

    handleAdd = () => {
        this.setState({id: void 0, visible: true});
    };

    handleEdit = (id) => {
        this.setState({id, visible: true});
    };

    render() {
        const {
            loading,
            dataSource,
            total,
            pageNum,
            pageSize,
            visible,
            id,
        } = this.state;

        return (
            <PageContent loading={loading}>
                <QueryBar>
                    <QueryItem
                        loadOptions={this.fetchOptions}
                        items={this.queryItems}
                        onSubmit={params => this.setState({params}, this.handleSearch)}
                    />
                </QueryBar>

                <ToolBar items={this.toolItems}/>

                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                />

                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({pageNum}, this.handleSearch)}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, this.handleSearch)}
                />
                <FixBottom>
                    <ToolItem items={this.bottomToolItems}/>
                </FixBottom>

                <UserCenterEdit
                    id={id}
                    visible={visible}
                    onOk={() => this.setState({visible: false})}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
