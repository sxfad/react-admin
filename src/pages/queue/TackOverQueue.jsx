import React, {Component} from 'react';
import {Button, Form, Modal} from 'antd';
import config from '@/commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
    Pagination,
} from '@/library/components';
import moment from 'moment';

@config({
    ajax: true,
})
@Form.create()
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 10,       // 分页每页显示条数
        id: null,           // 需要修改的数据id
    };

    columns = [
        {title: '集群', dataIndex: 'colony', width: 100},
        {title: '队列', dataIndex: 'name'},
        {title: '接管时间', dataIndex: 'time', width: 100, render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''},
        {title: '深度', dataIndex: 'deep', width: 100},

        {title: '状态', dataIndex: 'status', width: 100},
        {
            title: '操作', dataIndex: 'operator', width: 350,
            render: (value, record) => {
                const items = [
                    {
                        label: '取消接管',
                        onClick: () => {
                            Modal.confirm({
                                title: '温馨提示',
                                content: '您确定取消接管吗？',
                                onOk: () => {
                                    // TODO
                                },
                            });
                        },
                    },
                    {
                        label: '释放消息（持续）',
                        onClick: () => {
                            Modal.confirm({
                                title: '温馨提示',
                                content: '您确定释放消息（持续）吗？',
                                onOk: () => {
                                    // TODO
                                },
                            });
                        },
                    },
                    {
                        label: '释放消息（1条）',
                        onClick: () => {
                            Modal.confirm({
                                title: '温馨提示',
                                content: '您确定释放消息（1条）吗？',
                                onOk: () => {
                                    // TODO
                                },
                            });
                        },
                    },
                ];

                return <Operator items={items}/>;
            },
        },
    ];

    componentDidMount() {
        this.handleSearch();
    }

    handleSearch = (e) => {
        e && e.preventDefault();
        if (this.state.loading) return;

        this.props.form.validateFieldsAndScroll((err, values) => {

            console.log(values);
            if (err) return;

            const {pageNum, pageSize} = this.state;
            const params = {
                ...values,
                pageNum,
                pageSize,
            };

            this.setState({loading: true});
            this.props.ajax.get('/mock/users', params)
                .then(res => {
                    const dataSource = res?.list || [];
                    const total = res?.total || 0;

                    this.setState({dataSource, total});
                })
                .finally(() => this.setState({loading: false}));
        });
    };

    render() {
        const {
            loading,
            dataSource,
            total,
            pageNum,
            pageSize,
        } = this.state;

        const {form} = this.props;
        const formProps = {
            form,
            width: 300,
            style: {paddingLeft: 16},
        };
        return (
            <div>
                <QueryBar>
                    <Form onSubmit={this.handleSearch}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="查询队列"
                                field="name"
                                allowClear
                            />
                            <FormElement layout width="auto">
                                <Button type="primary" htmlType="submit">查询</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>

                <Table
                    loading={loading}
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
            </div>
        );
    }
}
