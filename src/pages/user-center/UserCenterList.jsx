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
    };

    // TODO 查询条件
    queryItems = [
        [
            {
                type: 'input',
                field: 'userNo',
                label: '用户号',
            },
            {
                type: 'input',
                field: 'inMno',
                label: '用户商编',
            },
        ],
    ];

    // TODO 顶部工具条
    toolItems = [
        {
            type: '',
            text: '',
            icon: '',
            onClick: () => {
                // TODO
            },
        },
        {
            type: '',
            text: '',
            icon: '',
            onClick: () => {
                // TODO
            },
        },
    ];

    // TODO 底部工具条
    bottomToolItems = [
        {
            type: '',
            text: '',
            icon: '',
            onClick: () => {
                // TODO
            },
        },
    ];

    columns = [
        {title: '客户号', dataIndex: 'customerNo'},
        {title: '用户号', dataIndex: 'userNo'},
        {title: '用户商编', dataIndex: 'inMno'},
        {title: '产品编码', dataIndex: 'productCode'},
        {title: '状态(00', dataIndex: 'state'},
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
                            this.props.history.push(`/user-center/+edit`);
                        },
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定要删除“${customerNo}”？`,
                            onConfirm: () => {
                                this.props.ajax.del(`/user-center/${id}`, null, {successTip}).then(() => {
                                    const dataSource = this.state.dataSource.filter(item => item.id !== id);
                                    this.setState({dataSource});
                                });
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
            .get('/user-center', {...params, pageNum, pageSize})
            .then(res => {
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

    render() {
        const {
            loading,
            dataSource,
            total,
            pageNum,
            pageSize,
        } = this.state;

        return (
            <PageContent loading={loading}>
                <QueryBar
                    showCollapsed
                    onCollapsedChange={collapsed => this.setState({collapsed})}
                >
                    <QueryItem
                        loadOptions={this.fetchOptions}
                        items={this.queryItems}
                        onSubmit={params => this.setState({params}, this.handleSearch)}
                    />
                </QueryBar>
                <ToolBar
                    items={this.toolItems}
                />
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
            </PageContent>
        );
    }
}
