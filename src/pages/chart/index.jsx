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
    path: '/chart',
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
        {title: '图标标题', dataIndex: 'title', width: 200},
        {title: 'type', dataIndex: 'type', width: 200},
        {title: '描述', dataIndex: 'description', width: 200},
        {title: '消息标识', dataIndex: 'messageToken', width: 200},
        {title: '纵轴显示标签个数', dataIndex: 'valueTickCount', width: 200},
        {title: '横轴系显示标签个数', dataIndex: 'labelTickCount', width: 200},
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
        this.props.ajax.get('/chart', params)
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
        this.props.ajax.del(`/chart/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
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
                this.props.ajax.del('/chart', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'})
                    .then(() => this.form.submit())
                    .finally(() => this.setState({deleting: false}));
            },
        })
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
                    <Form
                        name="chart-query"
                        ref={form => this.form = form}
                        onFinish={this.handleSubmit}
                    >
                        <FormRow>
                            <FormElement
                                {...formProps}
                                type="select"
                                label="图标标题"
                                name="title"
                                options={[
                                    {value: '1', label: '选项1'},
                                    {value: '2', label: '选项2'},
                                ]}
                            />
                            <FormElement
                                {...formProps}
                                label="type"
                                name="type"
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button onClick={() => this.form.resetFields()}>重置</Button>
                            </FormElement>
                            <Button type="primary" onClick={() => this.setState({visible: true, id: null})}>添加</Button>
                            <Button danger disabled={disabledDelete} onClick={this.handleBatchDelete}>删除</Button>
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
