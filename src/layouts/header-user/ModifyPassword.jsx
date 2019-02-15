import React, {Component} from 'react';
import {Modal, Form, Spin} from 'antd';
import config from '@/commons/config-hoc';
import {FormElement} from "@/library/antd";

@config({
    ajax: true,
    connect: state => ({loginUser: state.system.loginUser}),
})
@Form.create()
export default class ModifyPassword extends Component {
    state = {
        loading: false,
    };

    componentDidUpdate(prevProps) {
        const {visible, form: {resetFields}} = this.props;

        // 打开弹框 重置表单，接下来填充新的数据
        if (!prevProps.visible && visible) resetFields();
    }

    handleOk = (e) => {
        e.preventDefault();

        const {loading} = this.state;
        if (loading) return;

        const {onOk, form: {validateFieldsAndScroll}} = this.props;

        validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values);
                this.setState({loading: true});
                this.props.ajax.post(`/users/${values.id}/password`, values)
                    .then(() => {
                        if (onOk) onOk();
                    })
                    .finally(() => this.setState({loading: false}));

            }
        });
    };

    handleCancel = () => {
        const {onCancel} = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const {
            visible,
            loginUser,
            form,
        } = this.props;
        const id = loginUser?.id;
        const {loading} = this.state;
        const labelWidth = 100;

        return (
            <Modal
                width={420}
                visible={visible}
                title="修改密码"
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <Spin spinning={loading}>
                    <Form>
                        <FormElement form={form} type="hidden" field="id" decorator={{initialValue: id}}/>
                        <FormElement
                            form={form}
                            label="原密码"
                            labelWidth={labelWidth}
                            type="password"
                            field="oldPassword"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入原密码！'},
                                ],
                            }}
                        />
                        <FormElement
                            form={form}
                            label="新密码"
                            labelWidth={labelWidth}
                            type="password"
                            field="newPassword"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入新密码！'},
                                ],
                            }}
                        />
                        <FormElement
                            form={form}
                            label="确认密码"
                            labelWidth={labelWidth}
                            type="password"
                            field="reNewPassword"
                            decorator={{
                                rules: [
                                    {required: true, message: '请输入确认密码！'},
                                    {
                                        validator: (rule, value, callback) => {
                                            const newPassword = form.getFieldValue('newPassword');
                                            if (value && newPassword && newPassword !== value) {
                                                return callback('确认密码要与新密码相同');
                                            }

                                            return callback();
                                        }
                                    }
                                ],
                            }}
                        />
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

