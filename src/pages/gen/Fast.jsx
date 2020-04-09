import React, {Component} from 'react';
import {Form, Button} from 'antd';
import {FormElement, FormRow, Operator, Table, tableEditable} from 'src/library/components';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

const EditTable = tableEditable(Table);

const DB_URL_STORE_KEY = 'GEN_DB_URL';

const renderContent = (value, record) => {
    const obj = {
        children: value,
        props: {},
    };
    if ('children' in record) {
        obj.props.colSpan = 0;
    }
    return obj;
};

@config({ajax: true})
export default class Fast extends Component {
    state = {
        loading: false,
        selectedRowKeys: [],
        dataSource: [
            {
                id: '1',
                tableName: 'user_center',
                children: [
                    {
                        id: '11',
                        tableName: '测试',
                        field: 'name11',
                        comment: '用户名 唯一不可重复',
                        simpleComment: '用户名',
                    },
                    {
                        id: '22',
                        tableName: '测试',
                        field: 'name22',
                        comment: '用户名 唯一不可重复',
                        simpleComment: '用户名',
                    },
                ],
            },
            {
                id: '21',
                tableName: 'role',
                children: [
                    {
                        id: '211',
                        tableName: '测试',
                        field: 'name211',
                        comment: '用户名 唯一不可重复',
                        simpleComment: '用户名',
                    },
                    {
                        id: '222',
                        tableName: '测试',
                        field: 'name222',
                        comment: '用户名 唯一不可重复',
                        simpleComment: '用户名',
                    },
                ],
            },
        ],
    };

    columns = [
        {
            title: '表名', dataIndex: 'tableName',
        },
        {
            title: '列名', dataIndex: 'field',
            render: (value, record) => {
                if ('children' in record) {
                    const {tableName} = record;
                    return {
                        children: (
                            <Form
                                style={{
                                    display: 'inline-block',
                                }}
                                ref={form => record.form = form}
                                name={tableName}
                                initialValues={{
                                    listPage: true,
                                    selectable: true,
                                    pagination: true,
                                    serialNumber: true,
                                    editPage: true,
                                    editType: 'modalEdit',
                                }}
                            >
                                <FormRow>
                                    <FormElement
                                        type="checkbox"
                                        label="列表页"
                                        name="listPage"
                                        width={80}
                                        style={{paddingLeft: 0}}
                                    />
                                    <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.listPage !== curValues.listPage}>
                                        {({getFieldValue}) => {
                                            const listPage = getFieldValue('listPage');
                                            if (listPage) return (
                                                <FormRow>
                                                    <FormElement
                                                        type="switch"
                                                        name="selectable"
                                                        checkedChildren="有选中"
                                                        unCheckedChildren="无选中"
                                                    />
                                                    <FormElement
                                                        type="switch"
                                                        name="pagination"
                                                        checkedChildren="有分页"
                                                        unCheckedChildren="无分页"
                                                    />
                                                    <FormElement
                                                        type="switch"
                                                        name="serialNumber"
                                                        checkedChildren="有序号"
                                                        unCheckedChildren="无序号"
                                                    />
                                                </FormRow>
                                            );

                                            return null;
                                        }}
                                    </Form.Item>
                                    <FormElement
                                        type="checkbox"
                                        label="编辑页"
                                        name="editPage"
                                        width={80}
                                        style={{marginLeft: 50}}
                                    />
                                    <Form.Item shouldUpdate={(prevValues, curValues) => prevValues.editPage !== curValues.editPage}>
                                        {({getFieldValue}) => {
                                            const editPage = getFieldValue('editPage');
                                            if (editPage) return (
                                                <FormElement
                                                    type="radio-group"
                                                    name="editType"
                                                    width={200}
                                                    options={[
                                                        {value: 'pageEdit', label: '页面'},
                                                        {value: 'modalEdit', label: '弹框'},
                                                    ]}
                                                />
                                            );

                                            return null;
                                        }}
                                    </Form.Item>
                                </FormRow>
                            </Form>
                        ),
                        props: {
                            colSpan: 3,
                        },
                    };
                }
                return value;
            },
        },
        // {title: '长度', dataIndex: 'length'},
        // {title: '是否为空', dataIndex: 'nullable'},
        {title: '数据库注释', dataIndex: 'comment', render: renderContent},
        {title: '简化注释', dataIndex: 'simpleComment', render: renderContent},
        {
            title: '操作', dataIndex: 'operator', width: 100,
            render: (value, record) => {
                const {id, name} = record;
                const items = [
                    {
                        label: '删除',
                        color: 'red',
                        confirm: {
                            title: `您确定删除"${name}"?`,
                            onConfirm: () => this.handleDelete(id),
                        },
                    },
                ];

                return {
                    children: <Operator items={items}/>,
                    props: {colSpan: 1},
                };
            },
        },
    ];

    componentDidMount() {
        const dbUrl = window.localStorage.getItem(DB_URL_STORE_KEY);
        if (dbUrl) this.form.setFieldsValue({dbUrl});
    }

    handleSubmit = (values) => {
        this.setState({loading: true});
        this.props.ajax.get('/gen/tables', values, {baseURL: '/'})
            .then(res => {
                console.log(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleDbUrlChange = (e) => {
        const dbUrl = e.target.value;

        // 进行本地存储，记录数据库地址，使用原生存储，不区分用户
        window.localStorage.setItem(DB_URL_STORE_KEY, dbUrl);
    };

    handleDelete = (id) => {
        // TODO
    };

    handleGen = () => {
        const {selectedRowKeys} = this.state;
        console.log(selectedRowKeys);
        // TODO
    };

    render() {
        const {dataSource, selectedRowKeys, loading} = this.state;

        const formProps = {
            width: '50%',
        };
        return (
            <PageContent style={{padding: 0, margin: 0}} loading={loading}>
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                >
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="数据库地址"
                            name="dbUrl"
                            required
                            onChange={this.handleDbUrlChange}
                        />
                        <Button style={{margin: '0 8px'}} type="primary" htmlType="submit">获取数据库表</Button>
                        <Button onClick={this.handleGen}>生成选中表</Button>
                    </FormRow>
                </Form>
                <EditTable
                    rowSelection={{
                        selectedRowKeys,
                        onChange: selectedRowKeys => this.setState({selectedRowKeys}),
                    }}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="id"
                />
            </PageContent>
        );
    }
}
