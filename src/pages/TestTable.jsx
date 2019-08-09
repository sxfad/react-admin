import React, {Component} from 'react';
import {Table, Button, Row, Col, Form} from 'antd';
import {FormElement, tableEditable} from '@/library/antd';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';

const EditableTable = tableEditable(Table);

const dataSource = [];
for (let i = 0; i < 20; i++) {
    dataSource.push({id: i, name: i, age: i, job: i});
}

const dataSource2 = [];
for (let i = 0; i < 2; i++) {
    dataSource2.push({id: i, name: i, age: i, job: i});
}

@config({path: '/test-table'})
@Form.create()
export default class TestTable extends Component {
    state = {};

    columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: 200,
            formProps: {
                type: 'input',
                required: true,
            }
        },
        {
            title: '年龄',
            dataIndex: 'age',
            width: 200,
            formProps: {
                type: 'select',
                options: [
                    {value: 0, label: '未知年龄'},
                    {value: 1, label: '1岁了'},
                ],
            },
        },
        {
            title: '工作',
            dataIndex: 'job',
            width: 200,
            formProps: {
                type: 'select',
                options: [
                    {value: 0, label: '未知工作'},
                    {value: 1, label: '自由职业者'},
                ],
            },
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 200,
            formProps: {
                type: 'input',
            },
        },
        {
            title: '电话',
            dataIndex: 'phone',
            width: 200,
            formProps: {
                type: 'input',
            },
        },
    ];

    componentDidMount() {
        this.setState({dataSource});
    }

    // 这样可以保证每次render时，FormElement不是每次都创建，这里可以进行一些共用属性的设置
    FormElement = (props) => <FormElement form={this.props.form} labelWidth={100} disabled={this.props.isDetail} {...props}/>;

    render() {

        const FormElement = this.FormElement;
        return (
            <PageContent>
                <div style={{width: 100, height: 100, overflow: 'hidden'}}>
                    <div
                        style={{
                            width: 100,
                            height: 100,
                            background: 'green',
                            borderBottomRightRadius: 100,
                            boxShadow: `10px 0 0 10px blue`,
                            overflow: 'hidden',
                        }}/>
                </div>
                <Button onClick={() => this.props.form.resetFields()}>重置</Button>
                <Button style={{margin: '0 10px'}} onClick={() => this.props.form.setFieldsValue({table: dataSource})}>数据1</Button>
                <Button onClick={() => this.props.form.setFieldsValue({table: dataSource2})}>数据2</Button>

                <Form onSubmit={this.handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <FormElement
                                label="可编辑表格"
                                field="table"
                                initialValue={this.state.dataSource}
                            >
                                <EditableTable
                                    // size="small"
                                    // bordered
                                    columns={this.columns}
                                    rowKey="id"
                                    pagination={false}
                                />
                            </FormElement>
                        </Col>
                    </Row>
                </Form>
            </PageContent>
        );
    }
}
