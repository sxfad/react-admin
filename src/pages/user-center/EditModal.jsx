import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改' : '添加',
    },
})
export default class EditModal extends Component {
    state = {
        loading: false, // 页面加载loading
        data: {},       // 表单回显数据
    };

    componentDidMount() {
        const {isEdit} = this.props;

        if (isEdit) {
            this.fetchData();
        }
    }

    fetchData = () => {
        if (this.state.loading) return;

        const {id} = this.props;

        this.setState({loading: true});
        this.props.ajax.get(`/user-center/${id}`)
            .then(res => {
                this.setState({data: res || {}});
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.props;
        const successTip = isEdit ? '修改成功！' : '添加成功！';
        const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
        const ajaxUrl = isEdit ? '/user-center' : '/user-center';

        this.setState({loading: true});
        ajaxMethod(ajaxUrl, values, {successTip})
            .then(() => {
                const {onOk} = this.props;
                onOk && onOk();
            })
            .finally(() => this.setState({loading: false}));
    };

    render() {
        const {isEdit} = this.props;
        const {loading, data} = this.state;
        const formProps = {
            labelWidth: 100,
        };
        return (
            <ModalContent
                loading={loading}
                okText="保存"
                cancelText="重置"
                onOk={() => this.form.submit()}
                onCancel={() => this.form.resetFields()}
            >
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                    initialValues={data}
                >
                    {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                    <FormElement
                        {...formProps}
                        label="account"
                        name="account"
                        required
                        maxLength={255}
                    />
                    <FormElement
                        {...formProps}
                        type="password"
                        label="密码"
                        name="password"
                        required
                        maxLength={255}
                    />
                    <FormElement
                        {...formProps}
                        label="用户名"
                        name="name"
                        maxLength={20}
                    />
                    <FormElement
                        {...formProps}
                        type="mobile"
                        label="手机"
                        name="mobile"
                        maxLength={20}
                    />
                    <FormElement
                        {...formProps}
                        type="email"
                        label="邮箱"
                        name="email"
                        required
                        maxLength={50}
                    />
                    <FormElement
                        {...formProps}
                        type="switch"
                        label="是否启用"
                        name="enabled"
                    />
                </Form>
            </ModalContent>
        );
    }
}
