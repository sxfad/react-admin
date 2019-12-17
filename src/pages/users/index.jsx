import React, {Component} from 'react';
import {Button, Form, Modal} from 'antd';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    ToolBar,
    Table,
    Operator,
    Pagination,
} from '@/library/components';
import EditModal from './EditModal';

@config({
    path: '/users',
    ajax: true,
})
@Form.create()
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        dataSource: [],     // 表格数据
        selectedRowKeys: [],// 表格中选中行keys
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 10,       // 分页每页显示条数
        deleting: false,    // 批量删除中loading
        singleDeleting: {}, // 操作列删除loading
        visible: false,     // 添加、修改弹框
        id: null,           // 需要修改的数据id
    };

    columns = [
        {title: '用户名', dataIndex: 'name', width: 200},
        {title: '年龄', dataIndex: 'age', width: 200},
        {title: '工作', dataIndex: 'job', width: 200},
        {title: '职位', dataIndex: 'position', width: 200},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const {singleDeleting} = this.state;
                const deleting = singleDeleting[id];
                const items = [
                    {
                        label: '编辑',
                        onClick: () => this.setState({visible: true, id}),
                    },
                    {
                        label: '删除',
                        color: 'red',
                        loading: deleting,
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
        this.handleSearch();
    }

    handleSearch = (e) => {
        e && e.preventDefault();
        if (this.state.loading) return;

        this.props.form.validateFieldsAndScroll((err, values) => {
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

    handleDelete = (id) => {
        const singleDeleting = {...this.state.singleDeleting};

        if (singleDeleting[id]) return;

        singleDeleting[id] = true;
        this.setState({singleDeleting});
        this.props.ajax.del(`/mock/users/${id}`, null, {successTip: '删除成功！', errorTip: '删除失败！'})
            .then(() => this.handleSearch())
            .finally(() => {
                singleDeleting[id] = false;
                this.setState({singleDeleting});
            });
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
                this.props.ajax.del('/mock/users', {ids: selectedRowKeys}, {successTip: '删除成功！', errorTip: '删除失败！'})
                    .then(() => this.handleSearch())
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

        const {form} = this.props;
        const formProps = {
            form,
            width: 300,
            style: {paddingLeft: 16},
        };
        const disabledDelete = !selectedRowKeys?.length;
        return (
            <PageContent>
                <QueryBar>
                    <Form onSubmit={this.handleSearch}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                label="名称"
                                field="name"
                            />
                            <FormElement
                                {...formProps}
                                type="select"
                                label="职位"
                                field="job"
                                options={[
                                    {value: 1, label: 1},
                                    {value: 2, label: 2},
                                ]}
                            />
                            <FormElement layout>
                                <Button type="primary" htmlType="submit">提交</Button>
                                <Button onClick={() => form.resetFields()}>重置</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>

                <ToolBar
                    items={[
                        {
                            type: 'primary',
                            icon: 'plus',
                            text: '添加',
                            onClick: () => this.setState({visible: true, id: null}),
                        },
                        {
                            type: 'danger',
                            icon: 'delete',
                            text: '删除',
                            loading: deleting,
                            disabled: disabledDelete,
                            onClick: this.handleBatchDelete,
                        },
                    ]}
                />

                <Table
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}
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
                <EditModal
                    visible={visible}
                    id={id}
                    isEdit={id !== null}
                    onOk={() => this.setState({visible: false}, this.handleSearch)}
                    onCancel={() => this.setState({visible: false})}
                />
            </PageContent>
        );
    }
}
