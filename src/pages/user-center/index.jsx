import React, {Component} from 'react';
import {Button, Form, Modal} from 'antd';
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
    path: '/user-center',
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        selectedRowKeys: [],// 表格中选中行keys
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 20,       // 分页每页显示条数
        deleting: false,    // 删除中loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
    };

    columns = [
        {title: 'account', dataIndex: 'account', width: 200},
        {title: '密码', dataIndex: 'password', width: 200},
        {title: '用户名', dataIndex: 'name', width: 200},
        {title: '手机', dataIndex: 'mobile', width: 200},
        {title: '邮箱', dataIndex: 'email', width: 200},
        {title: '是否启用', dataIndex: 'enabled', width: 200},
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

                return <Operator items={items}/>
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
        this.props.ajax.get('/user-center', params)
            .then(res => {
                const dataSource = res?.list || [];
                const total = res?.total || 0;

                this.setState({dataSource, total});
            })
            .finally(() => this.setState({loading: false}));
    };

    handleDelete = (id) => {
        if(this.state.deleting) return;

        this.setState({deleting: true});
        this.props.ajax.del(`/user-center/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
            .then(() => this.form.submit())
            .finally(() => this.setState({deleting: false}));
    };

    handleBatchDelete = () => {
        if (this.state.deleting) return;

        const {selectedRowKeys} = this.state;
        const content = (
            <span>
                您确定删除
                <span style={{padding: '0 5px', color: 'red', fontSize: 18}}>
                    {selectedRowKeys.length}
                </span>
                条记录吗？
            </span>
        );
        Modal.confirm({
            title: '温馨提示',
            content,
            onOk: () => {
                this.setState({deleting: true});
                this.props.ajax.del('/user-center', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'})
                    .then(() => this.form.submit())
                    .finally(() => this.setState({deleting: false}));
            },
        })
    };

    handleImport = () => {
        // TODO
    };
    
    handle2 = () => {
        // TODO
    };
    
    render() {
        const {
            loading,
            deleting,
            dataSource,
            selectedRowKeys,
            total,
            pageNum,
            pageSize,
            visible,
            id,
        } = this.state;

        const formProps = {
            width: 220,
            style: {paddingLeft: 16},
        };
        const disabledDelete = !selectedRowKeys?.length;

        return (
            <PageContent loading={loading || deleting}>
                <QueryBar>
                    <Form onFinish={this.handleSubmit} ref={form => this.form = form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="用户名"
                                name="name"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button onClick={() => this.form.resetFields()}>重置</Button>
                            </FormElement>
                            <Button type="primary" onClick={() => this.setState({visible: true, id: null})}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={this.handleBatchDelete}>删除</Button>
                            <Button type="primary" onClick={this.handleImport}>导入</Button>
                        </FormRow>
                    </Form>
                </QueryBar>
                <Table
                    serialNumber
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}
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
                    onPageNumChange={pageNum => this.setState({pageNum}, () => this.form.submit())}
                    onPageSizeChange={pageSize => this.setState({pageSize, pageNum: 1}, () => this.form.submit())}
                />
                <EditModal
                    visible={visible}
                    id={id}
                    isEdit={id !== null}
                    onOk={() => this.setState({visible: false}, () => this.form.submit())}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
