import React, { Component } from 'react';
import { Form } from 'antd';
import config from 'src/commons/config-hoc';
import { FormElement, ModalContent, PageContent } from 'ra-lib';

@config({
    ajax: true,
    connect: state => ({ loginUser: state.layout.loginUser }),
    modal: {
        title: '修改密码',
        width: 420,
    },
})
export default class ModifyPassword extends Component {
    state = {
        loading: false,
    };

    handleOk = (values) => {
        if (this.state.loading) return;
        const { onOk } = this.props;

        this.setState({ loading: true });
        this.props.ajax.put('/updatePassword', values, { successTip: '密码设置成功！' })
            .then(() => {
                if (onOk) onOk();
            })
            .finally(() => this.setState({ loading: false }));
    };

    handleCancel = () => {
        const { onCancel } = this.props;
        if (onCancel) onCancel();
    };

    render() {
        const { loginUser } = this.props;
        const id = loginUser?.id;
        const { loading } = this.state;
        const labelWidth = 100;

        return (
            <ModalContent
                loading={loading}
                surplusSpace={false}
                onOk={() => this.form.submit()}
                onCancel={this.handleCancel}
            >
                <PageContent>
                    <Form ref={form => this.form = form} onFinish={this.handleOk} initialValues={{ id }}>
                        <FormElement type="hidden" name="id"/>

                        <FormElement
                            label="当前账号"
                            labelWidth={labelWidth}
                            layout
                            colon
                        >{loginUser?.account}</FormElement>

                        <FormElement
                            label="原密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="oldPassword"
                            autoFocus
                            placeholder="第一次设置密码，原密码可以为空"
                        />
                        <FormElement
                            label="新密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="password"
                            required
                        />
                        <FormElement
                            label="确认密码"
                            labelWidth={labelWidth}
                            type="password"
                            name="reNewPassword"
                            dependencies={[ 'password' ]}
                            required
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('新密码与确认新密码不同！');
                                    },
                                }),
                            ]}
                        />
                    </Form>
                </PageContent>
            </ModalContent>
        );
    }
}

