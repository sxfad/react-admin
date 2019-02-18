import React, {Component} from 'react';
import {Button, Table} from 'antd';
import PageContent from '@/layouts/page-content';
import FixBottom from '@/layouts/fix-bottom';
import {
    QueryBar,
    QueryItem,
    Pagination,
    Operator,
    ToolBar,
} from "@/library/antd";
import config from '@/commons/config-hoc';

@config({
    path: '/users',
})
export default class UserCenter extends Component {
    state = {
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageSize: 10,       // 分页每页显示条数
        pageNum: 1,         // 分页当前页
        params: {},         // 查询条件
        jobs: [],           // 工作下拉数据
        positions: [],      // 职位下拉数据
        collapsed: true,    // 是否收起
    };

    queryItems = [
        [
            {
                type: 'select',
                field: 'position',
                label: '职位',
                placeholder: '请选择职位',
                itemStyle: {flex: '0 0 200px'}, // 固定宽度
            },
            {
                type: 'select',
                field: 'job',
                label: '工作',
                placeholder: '请选择工作',
                itemStyle: {flex: '0 0 200px'}, // 固定宽度
            },
        ],
        [
            {
                collapsedShow: true, // 收起时显示
                type: 'input',
                field: 'name',
                label: '用户名',
                placeholder: '请输入用户名',
                itemStyle: {flex: '0 0 200px'}, // 固定宽度
            },
            {
                collapsedShow: true,
                type: 'number',
                field: 'age',
                label: '年龄',
                min: 0,
                max: 150,
                step: 1,
                placeholder: '请输入年龄',
                itemStyle: {flex: '0 0 200px'}, // 固定宽度
            },
        ],
    ];

    columns = [
        {title: '用户名', dataIndex: 'name', key: 'name'},
        {title: '年龄', dataIndex: 'age', key: 'age'},
        {
            title: '工作', dataIndex: 'job', key: 'job',
            render: (value) => {
                const job = this.state.jobs.find(item => item.value === value);
                return job ? job.label : '';
            }
        },
        {
            title: '职位', dataIndex: 'position', key: 'position',
            render: (value) => {
                const position = this.state.positions.find(item => item.value === value);
                return position ? position.label : '';
            }
        },
        {
            title: '操作', dataIndex: 'operator', key: 'operator',
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '编辑',
                        onClick: () => this.props.history.push(`/users/_/UserEdit/${id}?name=${name}`),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleSearch(),
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
        const {params, pageNum, pageSize} = this.state;
        console.log(params, pageNum, pageSize);

        const dataSource = [];
        for (let i = 0; i < pageSize; i++) {
            const id = pageSize * (pageNum - 1) + i + 1;
            dataSource.push({id: `${id}`, name: `张三${id}`, age: 23, job: '11', position: '22'});
        }

        this.setState({dataSource, total: 100});
    };

    fetchOptions = () => {
        const jobs = [
            {value: '11', label: '产品经理'},
            {value: '22', label: '测试专员'},
            {value: '33', label: '前端开发'},
            {value: '44', label: '后端开发'},
        ];

        const positions = [
            {value: '11', label: 'CEO'},
            {value: '22', label: 'CFO'},
            {value: '33', label: 'CTO'},
            {value: '44', label: 'COO'},
        ];

        this.setState({jobs, positions});

        return Promise.resolve({job: jobs, position: positions})
    };

    handleAdd = () => {
        // TODO
        this.props.history.push('/users/_/UserEdit/:id');
    };

    render() {
        const {
            total,
            pageNum,
            pageSize,
            collapsed,
            dataSource,
        } = this.state;
        console.log('render users');
        return (
            <PageContent>
                <QueryBar
                    showCollapsed
                    collapsed={collapsed}
                    onCollapsedChange={collapsed => this.setState({collapsed})}
                >
                    <QueryItem
                        collapsed={collapsed}
                        loadOptions={this.fetchOptions}
                        items={this.queryItems}
                        onSubmit={params => this.setState({params}, this.handleSearch)}
                        extra={<Button type="primary" icon="user-add" onClick={this.handleAdd}>添加用户</Button>}
                    />
                </QueryBar>

                <ToolBar
                    items={[
                        {type: 'primary', text: '添加用户', icon: 'user-add', onClick: this.handleAdd}
                    ]}
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
                    <Button>导出当前页</Button>
                    <Button type="primary">导出所有</Button>
                </FixBottom>
            </PageContent>
        );
    }
}
