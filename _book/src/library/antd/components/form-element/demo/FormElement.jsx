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

    render() {
        const {form} = this.props;
        const labelWidth = 100;

        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <FormElement
                        form={form}
                        type="number"
                        field="number"
                        label="数字"
                        labelWidth={labelWidth}
                        placeholder="请输入数字"
                        decorator={{
                            rules: [
                                {required: true, message: '不能为空！'}
                            ],
                        }}
                    >
                        <span className="ant-form-text"> machines</span>
                    </FormElement>

                    <FormElement
                        form={form}
                        type="input"
                        field="input"
                        label="输入框"
                        labelWidth={labelWidth}
                        placeholder="请输入"
                        decorator={{
                            rules: [
                                {required: true, message: '不能为空！'}
                            ],
                        }}
                    />

                    <FormElement
                        form={form}
                        type="select"
                        field="select"
                        label="下拉框"
                        labelWidth={labelWidth}
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
                        form={form}
                        type="date"
                        field="date"
                        label="日期"
                        labelWidth={labelWidth}
                        placeholder="请选择日期"
                        width={200}
                    />
                    <Form.Item
                        wrapperCol={{span: 12, offset: 6}}
                    >
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export const title = '基于配置获取表单元素';

export const markdown = `
通过配置的方式，获取表单元素
`;
