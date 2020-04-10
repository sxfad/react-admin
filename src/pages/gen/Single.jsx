import React, {Component} from 'react';
import {Button, Form, Modal} from 'antd';
import PageContent from 'src/layouts/page-content';
import config from 'src/commons/config-hoc';
import {
    QueryBar,
    FormRow,
    FormElement,
    Table,
    tableEditable, Operator,
} from 'src/library/components';
import {DB_URL_STORE_KEY, SWAGGER_URL_STORE_KEY, renderTags, renderFieldTags, getTables} from './index';
import uuid from 'uuid/v4';
import './style.less';
import {ExclamationCircleOutlined} from '@ant-design/icons';

const EditTable = tableEditable(Table);

@config({
    ajax: true,
})
export default class UserCenter extends Component {
    state = {
        loading: false,     // 表格加载数据loading
        total: 0,           // 分页中条数
        pageNum: 1,         // 分页当前页
        pageSize: 20,       // 分页每页显示条数
        deleting: false,    // 删除中loading
        table: {},          // 当前编辑table
        tables: [],         // 数据库表
        ignoreFields: [],   // 忽略字段
    };

    columns = [
        {title: '注释', dataIndex: 'comment', width: 200},
        {
            title: '中文名', dataIndex: 'chinese', width: 200,
            formProps: (record, index) => {
                return {
                    required: true,
                    tabIndex: index + 1, // index * 2 + 1
                    onBlur: (e) => {
                        record.chinese = e.target.value;
                    },
                };
            },
        },
        {
            title: '列名', dataIndex: 'field',
            formProps: (record, index) => {
                if (record.isTable) return null;

                return {
                    required: true,
                    tabIndex: index + 100, // index * 2 + 2
                    onBlur: (e) => {
                        record.field = e.target.value;
                    },
                };
            },
        },
        {
            title: '选项', dataIndex: 'operator', width: 160,
            render: (value, record) => {
                return renderFieldTags(record, () => this.setState({table: {...this.state.table}}));
            },
        },
        {
            title: '操作', dataIndex: 'operator', width: 40,
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

                return <Operator items={items}/>;
            },
        },
    ];

    componentDidMount() {
        const dbUrl = window.localStorage.getItem(DB_URL_STORE_KEY);
        const swaggerUrl = window.localStorage.getItem(SWAGGER_URL_STORE_KEY);
        this.form.setFieldsValue({swaggerUrl});

        if (dbUrl) {
            this.form.setFieldsValue({dbUrl});
            // 初始化查询
            this.handleDbUrlChange({target: {value: dbUrl}});
        }
    }

    handleTypeChange = (e) => {
        const type = e.target.value;
        if (type === 'mysql') {
            const value = this.form.getFieldValue('dbUrl');
            this.handleDbUrlChange({target: {value}});
        }
        if (type === 'customer') {
            const value = this.form.getFieldValue('moduleName');
            this.handleModuleNameChange({target: {value}});
        }
        if (type === 'swagger') {
            const value = this.form.getFieldValue('swaggerUrl');
            this.handleSwaggerChange({target: {value}});
        }
    };

    handleDbUrlChange = (e) => {
        const dbUrl = e.target.value;
        window.localStorage.setItem(DB_URL_STORE_KEY, dbUrl);

        // 清空数据
        this.setState({tables: [], table: {}});
        this.form.setFieldsValue({tableName: undefined});

        if (!dbUrl) return;

        this.setState({loading: true});
        this.props.ajax.get('/gen/tables', {dbUrl}, {baseURL: '/'})
            .then(res => {
                const {dataSource} = getTables(res);
                this.setState({tables: dataSource}, () => {

                    // 默认选中第一个表
                    const tableName = dataSource[0]?.tableName;

                    this.form.setFieldsValue({tableName});
                    this.handleTableNameChange(tableName);
                });
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSwaggerChange = (e) => {
        const swaggerUrl = e.target.value;
        window.localStorage.setItem(SWAGGER_URL_STORE_KEY, swaggerUrl);

        // 清空数据
        this.setState({tables: [], table: {}});
        this.form.setFieldsValue({tableName: undefined});

        if (!swaggerUrl) return;


        const method = this.form.getFieldValue('method');
        const userName = this.form.getFieldValue('userName');
        const password = this.form.getFieldValue('password');
        const params = {
            swaggerUrl,
            method,
            userName,
            password,
        };

        this.setState({loading: true});
        this.props.ajax.get('/gen/swagger', params, {baseURL: '/'})
            .then(res => {
                const {moduleName: tableName, queries, columns, forms} = res;

                const children = [];
                (queries || []).forEach(item => {
                    const {type, field, label, required} = item;
                    children.push({
                        id: uuid(),
                        tableName,
                        field,
                        comment: label,
                        chinese: label,
                        name: field,

                        type,
                        length: 0,
                        isNullable: !required,

                        isColumn: true,
                        isQuery: true,
                        isForm: true,
                        isIgnore: false,
                    });
                });

                (columns || []).forEach(item => {
                    const {title, dataIndex} = item;
                    if (!children.find(it => it.field === dataIndex)) {
                        children.push(
                            {
                                id: uuid(),
                                tableName,
                                field: dataIndex,
                                comment: title,
                                chinese: title,
                                name: dataIndex,

                                type: 'string',
                                length: 0,
                                isNullable: true,

                                isColumn: true,
                                isQuery: false,
                                isForm: true,
                                isIgnore: false,
                            },
                        );
                    }
                });

                (forms || []).forEach(item => {
                    const {type, field, label} = item;
                    if (!children.find(it => it.field === field)) {
                        children.push({
                            id: uuid(),
                            tableName,
                            field,
                            comment: label,
                            chinese: label,
                            name: field,

                            type,
                            length: 0,
                            isNullable: true,

                            isColumn: true,
                            isQuery: true,
                            isForm: true,
                            isIgnore: false,
                        });
                    }
                });


                const table = {
                    id: tableName,
                    isTable: true,
                    tableName,
                    comment: '',
                    listPage: true,
                    query: true,
                    selectable: true,
                    pagination: true,
                    serialNumber: true,
                    add: true,
                    operatorEdit: true,
                    operatorDelete: true,
                    batchDelete: true,

                    modalEdit: true,
                    pageEdit: false,
                    children,
                };

                this.setState({table});
            })
            .finally(() => this.setState({loading: false}));
    };

    handleModuleNameChange = (e) => {
        // 清空数据
        this.setState({tables: [], table: {}});

        const moduleName = e.target.value;
        if (!moduleName) return;

        const tableName = moduleName;
        const field = 'name';
        this.setState({
            table: {
                id: tableName,
                isTable: true,
                tableName,
                comment: '',
                listPage: true,
                query: true,
                selectable: true,
                pagination: true,
                serialNumber: true,
                add: true,
                operatorEdit: true,
                operatorDelete: true,
                batchDelete: true,

                modalEdit: true,
                pageEdit: false,
                children: [
                    {
                        id: uuid(),
                        tableName,
                        field,
                        comment: '用户名',
                        chinese: '用户名',
                        name: field,

                        type: 'string',
                        length: 0,
                        isNullable: true,

                        isColumn: true,
                        isQuery: true,
                        isForm: true,
                        isIgnore: false,
                    },
                ],
            },
        });

    };

    handleDelete = (id) => {
        const {table} = this.state;
        const {children} = table;
        table.children = children.filter(item => item.id !== id);
        this.setState({table: {...table}});
    };

    handleTableNameChange = (tableName) => {
        const {tables} = this.state;
        const table = tables.find(item => item.tableName === tableName);
        this.setState({table});
    };

    handleAdd = () => {
        const {table} = this.state;
        const length = table.children.length;
        const {tableName, children} = table;
        const field = `field${length + 1}`;
        const id = uuid();

        children.unshift({
            id,
            tableName,
            field,
            comment: '新增列',
            chinese: '新增列',
            name: field,

            type: 'string',
            length: 0,
            isNullable: true,

            isColumn: true,
            isQuery: false,
            isForm: true,
            isIgnore: false,
        });
        table.children = [...children];
        this.setState({table: {...table}});
    };

    handleGen = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined/>,
            title: '同名文件将被覆盖，是否继续？',
            content: '代码文件直接生成到项目目录中，会引起webpack的热更新，当前页面有可能会重新加载。',
            onOk: () => {
                const {table} = this.state;
                const children = table.children
                    .map(it => ({
                        field: it.field,
                        chinese: it.chinese,
                        name: it.name,
                        type: it.type,
                        length: it.length,
                        isNullable: it.isNullable,
                        isForm: it.isForm,
                        isColumn: it.isColumn,
                        isQuery: it.isQuery,
                    }));

                const params = {
                    tables: [{
                        ...table,
                        children,
                    }],
                };
                this.setState({loading: true});
                this.props.ajax.post('/gen/tables', params, {baseURL: '/', successTip: '生成成功！'})
                    .then(res => {
                        console.log(res);
                    })
                    .finally(() => this.setState({loading: false}));
            },
        });
    };

    render() {
        const {
            loading,
            deleting,
            tables,
            table,
        } = this.state;

        const formProps = {
            style: {paddingLeft: 16},
        };


        return (
            <PageContent loading={loading || deleting} style={{padding: 0, margin: 0}}>
                <QueryBar>
                    <Form ref={form => this.form = form} initialValues={{type: 'mysql', method: 'get', userName: 'admin', password: '123456'}}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                width={240}
                                type="radio-button"
                                name="type"
                                options={[
                                    {value: 'swagger', label: 'Swagger'},
                                    {value: 'mysql', label: 'MySql'},
                                    {value: 'customer', label: '自定义'},
                                ]}
                                onChange={this.handleTypeChange}
                            />
                            <Form.Item style={{marginBottom: 0}} shouldUpdate={(prevValues, currValues) => prevValues.type !== currValues.type}>
                                {({getFieldValue}) => {
                                    const type = getFieldValue('type');
                                    if (type === 'mysql') {
                                        return (
                                            <FormRow>
                                                <FormElement
                                                    {...formProps}
                                                    width={500}
                                                    label="数据库地址"
                                                    name="dbUrl"
                                                    onChange={this.handleDbUrlChange}
                                                />
                                                <FormElement
                                                    {...formProps}
                                                    width={300}
                                                    type="select"
                                                    showSearch
                                                    label="数据库表"
                                                    name="tableName"
                                                    onChange={this.handleTableNameChange}
                                                    options={tables.map(item => ({value: item.tableName, label: `${item.tableName} ${item.comment}`}))}
                                                />
                                            </FormRow>
                                        );
                                    }
                                    if (type === 'swagger') {
                                        return (
                                            <FormRow>
                                                <FormElement
                                                    {...formProps}
                                                    width={400}
                                                    label="接口地址"
                                                    name="swaggerUrl"
                                                    onChange={this.handleSwaggerChange}
                                                />
                                                <FormElement
                                                    {...formProps}
                                                    type="select"
                                                    width={100}
                                                    placeholder="接口方法"
                                                    name="method"
                                                    options={[
                                                        {value: 'get', label: 'GET'},
                                                        {value: 'post', label: 'POST'},
                                                        {value: 'put', label: 'PUT'},
                                                    ]}
                                                />
                                                <FormElement
                                                    {...formProps}
                                                    width={120}
                                                    placeholder="Swagger用户"
                                                    name="userName"
                                                />
                                                <FormElement
                                                    {...formProps}
                                                    width={120}
                                                    placeholder="Swagger密码"
                                                    name="password"
                                                />
                                            </FormRow>
                                        );
                                    }

                                    if (type === 'customer') {
                                        return (
                                            <FormRow>
                                                <FormElement
                                                    {...formProps}
                                                    width={300}
                                                    label="模块名"
                                                    name="moduleName"
                                                    placeholder="比如：user-center"
                                                    onChange={this.handleModuleNameChange}
                                                />
                                            </FormRow>
                                        );
                                    }
                                }}
                            </Form.Item>
                            <FormElement layout>
                                <Button type="primary" onClick={this.handleGen}>生成文件</Button>
                            </FormElement>
                        </FormRow>
                    </Form>
                </QueryBar>
                <div style={{marginBottom: 8, display: 'flex', justifyContent: 'space-between'}}>
                    <Button style={{marginRight: 8}} onClick={this.handleAdd}>添加</Button>
                    <div style={{paddingRight: 23, paddingTop: 3}}>
                        {renderTags(table, () => this.setState({table: {...table}}))}
                    </div>
                </div>
                <EditTable
                    serialNumber
                    columns={this.columns}
                    dataSource={table.children}
                    rowKey="id"
                />
            </PageContent>
        );
    }
}
