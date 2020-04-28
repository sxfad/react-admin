import React, {Component} from 'react';
import {Button, Form} from 'antd';
import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    Operator,
    Pagination,
} from 'src/library/components';
import EditModal from './EditModal';

@config({
    path: '/roles',
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 20,       // 分页每页显示条数
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
    };

    columns = [
        {title: '角色名称', dataIndex: 'name', width: 200},
        {title: '描述', dataIndex: 'description', width: 200},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '修改',
                        onClick: () => this.setState({visible: true, id}),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleDelete(id),
                        },
                    },
                    {
                        label: '权限',
                        onClick: this.handle2,
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

        const {pageNum, pageSize} = this.state;
        const params = {
            ...values,
            pageNum,
            pageSize,
        };

        this.setState({loading: true});
        this.props.ajax.get('/mock/role', params)
            .then(res => {
                const dataSource = res?.list || [];
                const total = res?.total || 0;

                this.setState({dataSource, total});
            })
            .finally(() => this.setState({loading: false}));
    };

    handleDelete = (id) => {
        if (this.state.deleting) return;

        this.setState({deleting: true});
        this.props.ajax.del(`/role/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
            .then(() => this.form.submit())
            .finally(() => this.setState({deleting: false}));
    };


    handle2 = () => {
        // TODO
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

        const {form} = this.props;
        const formProps = {
            form,
            width: 220,
            style: {paddingLeft: 16},
        };

        return (
            <PageContent>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={form => this.form = form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="角色名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button onClick={() => this.form.resetFields()}>重置</Button>
                            </FormElement>
                            <Button type="primary" onClick={() => this.setState({visible: true, id: null})}>添加</Button>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Table
                    serialNumber
                    loading={loading}
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pageNum={pageNum}
                    pageSize={pageSize}
                />
                <Pagination
                    total={total}
                    pageNum={pageNum}
                    pageSize={pageSize}
                    onPageNumChange={pageNum => this.setState({pageNum}, this.form.submit)}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, this.form.submit)}
                />
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
