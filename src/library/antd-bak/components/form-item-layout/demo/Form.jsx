import React, {Component} from 'react';
import {Input, Form, Button, Row, Col} from 'antd';
import {FormItemLayout} from '../../../index';

@Form.create()
export default class extends Component {

    handleSubmit = () => {
        const {form} = this.props;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
            }
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;
        const labelSpaceCount = 7;
        const tipWidth = 60;

        return (
            <Form>
                <Row>
                    <Col span={8}>
                        <FormItemLayout
                            label="用户名"
                            labelSpaceCount={labelSpaceCount}
                            tip="必填项"
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('name', {
                                rules: [
                                    {required: true, message: '请输入！'},
                                ],
                            })(
                                <Input/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={8}>
                        <FormItemLayout
                            label="密码"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: '请输入！'},
                                ],
                            })(
                                <Input/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={8}>
                        <FormItemLayout
                            label="工作单位"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('job', {
                                rules: [
                                    {required: true, message: '请输入！'},
                                ],
                            })(
                                <Input/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={8}>
                        <FormItemLayout
                            label="常用居住地址"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('address', {
                                rules: [
                                    {required: true, message: '请输入！'},
                                ],
                            })(
                                <Input/>
                            )}
                        </FormItemLayout>
                    </Col>

                    <Col span={8}>
                        <FormItemLayout
                            label="联系方式"
                            labelSpaceCount={labelSpaceCount}
                            tipWidth={tipWidth}
                        >
                            {getFieldDecorator('concat', {
                                rules: [
                                    {required: true, message: '请输入！'},
                                ],
                            })(
                                <Input/>
                            )}
                        </FormItemLayout>
                    </Col>
                </Row>

                <FormItemLayout
                    labelSpaceCount={labelSpaceCount}
                >
                    <Button onClick={this.handleSubmit}>提交</Button>
                </FormItemLayout>
            </Form>
        );
    }
}

export const title = '结合antd Form';

export const markdown = `
将FormItemLayout 代替 Form.Item 使用即可
`;
