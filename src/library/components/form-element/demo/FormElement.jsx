import React, {Component} from 'react';
import {Form, Button} from 'antd';
import {FormElement} from '../../../index';

@Form.create()
export default class extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    FormElement = (props) => <FormElement form={this.props.form} labelWidth={100} {...props}/>;

    render() {
        const FormElement = this.FormElement;

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormElement
                        type="number"
                        field="number"
                        label="数字"
                        placeholder="请输入数字"
                        tip="需要输入数字"
                        decorator={{
                            rules: [
                                {required: true, message: '不能为空！'}
                            ],
                        }}
                    />

                    <FormElement
                        field="input"
                        label="输入框"
                        placeholder="请输入"
                        decorator={{
                            rules: [
                                {required: true, message: '不能为空！'}
                            ],
                        }}
                    />

                    <FormElement
                        type="select"
                        field="select"
                        label="下拉框"
                        placeholder="请选择"
                        options={[
                            {label: '选项一', value: '1'},
                            {label: '选项二', value: '2'},
                            {label: '选项三', value: '3'},
                            {label: '选项四', value: '4'},
                            {label: '选项五', value: '5'},
                        ]}
                    />
                    <FormElement
                        type="date"
                        field="date"
                        label="日期"
                        placeholder="请选择日期"
                        width={200}
                    />
                    <FormElement layout>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </FormElement>
                </Form>
            </div>
        );
    }
}

export const title = '基于配置获取表单元素';

export const markdown = `
通过配置的方式，获取表单元素
`;
