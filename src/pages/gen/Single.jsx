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
import {DB_URL_STORE_KEY, renderTags, renderFieldTags, getTables} from './index';
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
        {title: '数据库注释', dataIndex: 'comment', width: 200},
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
            title: '列名', dataIndex: 'field', width: 200,
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
                return <div style={{textAlign: 'right'}}>{renderFieldTags(record, () => this.setState({table: {...this.state.table}}))}</div>;
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
        if (dbUrl) {
            this.form.setFieldsValue({dbUrl});
            // 初始化查询
            this.handleDbUrlChange({target: {value: dbUrl}});
        }
    }

    handleDbUrlChange = (e) => {
        const dbUrl = e.target.value;

        this.setState({loading: true});
        this.props.ajax.get('/gen/tables', {dbUrl}, {baseURL: '/'})
            .then(res => {
                const {dataSource} = getTables(res);
                this.setState({tables: dataSource});

                // 默认选中第一个表
                const tableName = dataSource[0]?.tableName;

                this.form.setFieldsValue({tableName});
                this.handleTableNameChange(tableName);
            })
            .finally(() => this.setState({loading: false}));
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
            width: 220,
            style: {paddingLeft: 16},
        };


        return (
            <PageContent loading={loading || deleting} style={{padding: 0, margin: 0}}>
                <QueryBar>
                    <Form ref={form => this.form = form}>
                        <FormRow>
                            <FormElement
                                {...formProps}
                                width={500}
                                label="数据库地址"
                                name="dbUrl"
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
