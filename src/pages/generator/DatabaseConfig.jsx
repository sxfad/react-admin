import React, {Component} from 'react';
import {Form, Row, Col, Button, Table} from 'antd';
import {FormElement} from '@/library/antd';
import {connect} from '@/models';

@connect(state => ({database: state.database}))
@Form.create({
    mapPropsToFields: (props) => {
        const fields = {};

        Object.keys(props.database).forEach(key => {
            fields[key] = Form.createFormField({
                ...props.database[key],
                value: props.database[key].value,
            });
        });

        return fields;
    },
    onFieldsChange: (props, fields) => {
        props.action.database.setFields(fields);
    },
})
export default class DatabaseConfig extends Component {
    state = {};

    componentWillMount() {
        const {formRef, form, validate} = this.props;
        if (formRef) formRef(form);

        if (validate) validate(this.validate)
    }


    componentDidMount() {

    }

    validate = () => {
        const {form} = this.props;

        return new Promise((resolve, reject) => {
            form.validateFieldsAndScroll((err, values) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(values)
                }
            });
        });
    };

    handleGetTableNames = () => {
        this.validate().then(values => {
            const {action: {database}, form: {getFieldValue, setFieldsValue}} = this.props;

            database.getTableNames({
                params: values,
                successTip: '获取数据库表成功',
                errorTip: '获取数据库表失败',
                onResolve: (data) => {
                    if (data?.length && !getFieldValue('table')) {
                        const value = data[0];

                        setFieldsValue({table: value});
                        this.handleGetTableColumns(value);
                    }
                }
            });
        });
    };

    handleGetTableColumns = (table) => {
        this.validate().then(values => {
            this.props.action.database
                .getTableColumns({
                    params: {...values, table},
                    successTip: '获取表格字段成功',
                    errorTip: '获取表格字段失败',
                });
        });
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={80} {...props}/>;

    render() {
        const {
            form,
            database: {
                tableNames,
                tableColumns,
                gettingTableNames,
                gettingTableColumns,
                showConfig,
            },
        } = this.props;
        const span = 8;

        const configRowStyle = {
            display: showConfig ? 'block' : 'none',
            borderBottom: '1px solid #d9d9d9',
            marginBottom: '24px',
        };

        const FormElement = this.FormElement;

        return (
            <Form>
                <Row style={configRowStyle}>
                    <Col span={span}>
                        <FormElement
                            label="地址"
                            tip="数据库ip地址"
                            field="host"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入地址',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="端口"
                            field="port"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入端口',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="用户名"
                            field="user"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入用户名',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="密码"
                            field="password"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入密码',},
                                ],
                            }}
                        />
                    </Col>

                    <Col span={span}>
                        <FormElement
                            label="数据库"
                            field="database"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入数据库',},
                                ],
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <FormElement
                            label="数据库表"
                            form={form}
                            field="table"
                            type="select"
                            allowClear
                            options={tableNames.map(value => ({value, label: value}))}
                            decorator={{
                                rules: [
                                    {required: false, message: '请选择数据库表',},
                                ],
                                onChange: (value) => {
                                    this.handleGetTableColumns(value);
                                },
                            }}
                        />
                    </Col>
                    <Col span={span} style={{paddingLeft: 16, paddingTop: 3}}>
                        <Button
                            loading={gettingTableNames}
                            type="primary"
                            onClick={this.handleGetTableNames}
                        >获取数据库表名</Button>
                    </Col>
                </Row>

                <Table
                    loading={gettingTableColumns}
                    size="small"
                    pagination={false}
                    columns={[
                        {title: '字段名', dataIndex: 'camelCaseName', key: 'camelCaseName'},
                        // {title: '中文名', dataIndex: 'chinese', key: 'chinese'},
                        {title: '类型', dataIndex: 'type', key: 'type'},
                        {title: '长度', dataIndex: 'length', key: 'length'},
                        {title: '是否可空', dataIndex: 'isNullable', key: 'isNullable', render: value => value ? '是' : '否'},
                        {title: '注释', dataIndex: 'comment', key: 'comment'},
                    ]}
                    rowKey="camelCaseName"
                    dataSource={tableColumns}
                />

            </Form>
        );
    }
}
