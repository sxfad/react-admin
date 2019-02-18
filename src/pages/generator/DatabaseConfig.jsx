import React, {Component} from 'react';
import {Form, Input, Row, Col, Icon, Tooltip, Button, Select, Table} from 'antd';
import {FormItemLayout} from 'sx-antd';
import {connect} from '../models';

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
            this.props.action.database.getTableNames({
                params: values,
                successTip: '获取数据库表成功',
                errorTip: '获取数据库表失败',
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

    render() {
        const {
            form: {getFieldDecorator},
            database: {
                tableNames,
                tableColumns,
                gettingTableNames,
                gettingTableColumns,
                showConfig,
            },
        } = this.props;
        const labelSpaceCount = 7;
        const span = 8;
        const tipWidth = 30;

        const configColStyle = {
            display: showConfig ? 'block' : 'none',
        };

        return (
            <Form>
                <Row style={{borderBottom: '1px solid #d9d9d9', marginBottom: '24px'}}>
                    <Col span={span} style={configColStyle}>
                        <FormItemLayout
                            label="host"
                            labelSpaceCount={labelSpaceCount}
                            tip={(
                                <Tooltip
                                    placement="right"
                                    title="数据库ip地址"
                                >
                                    <Icon type="question-circle-o"/>
                                </Tooltip>
                            )}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('host', {
                                rules: [
                                    {required: true, message: '请输入host',},
                                ],
                            })(
                                <Input placeholder="请输入host"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span} style={configColStyle}>
                        <FormItemLayout
                            label="port"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('port', {
                                rules: [
                                    {required: true, message: '请输入port',},
                                ],
                            })(
                                <Input placeholder="请输入port"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span} style={configColStyle}>
                        <FormItemLayout
                            label="user"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('user', {
                                rules: [
                                    {required: true, message: '请输入user',},
                                ],
                            })(
                                <Input placeholder="请输入user"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span} style={configColStyle}>
                        <FormItemLayout
                            label="password"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入password',},
                                ],
                            })(
                                <Input placeholder="请输入password"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span} style={configColStyle}>
                        <FormItemLayout
                            label="database"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('database', {
                                rules: [
                                    {required: true, message: '请输入database',},
                                ],
                            })(
                                <Input placeholder="请输入database"/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={span}>
                        <FormItemLayout
                            label=""
                            labelWidth={0}
                            tipWidth={tipWidth}
                        >
                            <a onClick={(e) => {
                                e.preventDefault();
                                this.props.action.database
                                    .setFields({showConfig: !showConfig})
                            }}>{showConfig ? '隐藏配置' : '显示配置'}</a>
                        </FormItemLayout>
                    </Col>
                </Row>
                <Row>
                    <Col span={span * 2}>
                        <FormItemLayout
                            label="table"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('table', {
                                rules: [
                                    {required: false, message: '请选择table',},
                                ],
                                onChange: (value) => {
                                    this.handleGetTableColumns(value);
                                },
                            })(
                                <Select
                                    showSearch
                                    placeholder="请选择table"
                                >
                                    {tableNames.map(name => (<Select.Option key={name} value={name}>{name}</Select.Option>))}
                                </Select>
                            )}
                        </FormItemLayout>
                    </Col>
                    <Col span={span}>
                        <FormItemLayout
                            label=""
                            labelWidth={0}
                            tipWidth={tipWidth}
                        >
                            <Button
                                loading={gettingTableNames}
                                type="primary"
                                onClick={this.handleGetTableNames}
                            >获取数据库表名</Button>
                        </FormItemLayout>
                    </Col>
                </Row>

                <Table
                    loading={gettingTableColumns}
                    size="small"
                    pagination={false}
                    columns={[
                        {title: '字段名', dataIndex: 'camelCaseName', key: 'camelCaseName'},
                        {title: '中文名', dataIndex: 'chinese', key: 'chinese'},
                        {title: '类型', dataIndex: 'type', key: 'type'},
                        {title: '长度', dataIndex: 'length', key: 'length'},
                        {title: '是否可空', dataIndex: 'isNullable', key: 'isNullable'},
                        {title: '注释', dataIndex: 'comment', key: 'comment'},
                    ]}
                    rowKey="camelCaseName"
                    dataSource={tableColumns}
                />

            </Form>
        );
    }
}
