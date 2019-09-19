import React, {Component} from 'react';
import {Form} from 'antd';
import config from '@/commons/config-hoc';
import {FormElement, ModalContent} from "@/library/components";
import PageContent from '@/layouts/page-content';

@config({
    ajax: true,
    connect: state => ({loginUser: state.system.loginUser}),
    modal: {
        title: '修改密码',
        width: 420,
    },
})
@Form.create()
export default class ModifyPassword extends Component {
    state = {
        loading: false,
    };

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
            loginUser,
            form,
        } = this.props;
        const id = loginUser?.id;
        const {loading} = this.state;
        const labelWidth = 100;

        return (
            <ModalContent
                loading={loading}
                surplusSpace={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <PageContent>
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
                </PageContent>
            </ModalContent>
        );
    }
}

