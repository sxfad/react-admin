import React, {Component} from 'react';
import {Button, Form, Modal, Radio} from 'antd';
import config from '@/commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
    Pagination,
} from '@/library/components';

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
        {title: '队列名称', dataIndex: 'name', width: 200},
        {title: '状态', dataIndex: 'status', width: 200},
        {title: 'ready', dataIndex: 'ready', width: 200},
        {title: 'unacked', dataIndex: 'unacked', width: 200},
        {title: 'total', dataIndex: 'total', width: 200},
        {title: 'incoming', dataIndex: 'incoming', width: 200},
        {title: 'deliver', dataIndex: 'deliver', width: 200},
        {title: 'ack', dataIndex: 'ack', width: 200},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const items = [
                    {
                        label: '接管队列',
                        onClick: () => {
                            Modal.confirm({
                                title: '温馨提示',
                                content: '集群A，AAA队列消息将被接管到保障雄，是否确认？',
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
            width: 332,
            style: {paddingLeft: 16},
        };
        return (
            <div>
                <QueryBar>
                    <Form onSubmit={this.handleSearch}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                width="auto"
                                field="colony"
                                label="选择集群"
                                onChange={() => setTimeout(this.handleSearch, 0)}
                            >
                                <Radio.Group>
                                    <Radio.Button value="a">集群A</Radio.Button>
                                    <Radio.Button value="b">集群B</Radio.Button>
                                    <Radio.Button value="c">集群C</Radio.Button>
                                    <Radio.Button value="d">集群D</Radio.Button>
                                </Radio.Group>
                            </FormElement>
                        </FormRow>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="查询队列"
                                field="name"
                                allowClear
                                placeholder="请输入队列名称"
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
