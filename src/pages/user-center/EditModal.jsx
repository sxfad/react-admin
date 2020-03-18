import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement} from '@/library/components';
import config from '@/commons/config-hoc';
import {ModalContent} from '@/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改' : '添加',
    },
})
@Form.create()
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

    handleSubmit = () => {
        if (this.state.loading) return;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;

            const {isEdit} = this.props;
            const successTip = isEdit ? '修改成功！' : '添加成功！';
            const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
            const ajaxUrl = isEdit ? '/user' : '/user-center';

            this.setState({loading: true});
            ajaxMethod(ajaxUrl, values, {successTip})
                .then(() => {
                    const {onOk} = this.props;
                    onOk && onOk();
                })
                .finally(() => this.setState({loading: false}));
        });
    };

    render() {
        const {isEdit, form} = this.props;
        const {loading, data} = this.state;
        const formProps = {
            labelWidth: 100,
            form,
        };
        return (
            <ModalContent
                loading={loading}
                okText="保存"
                cancelText="重置"
                onOk={this.handleSubmit}
                onCancel={() => form.resetFields()}
            >
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ? <FormElement {...formProps} type="hidden" field="id" initialValue={data.id}/> : null}
                    <FormElement
                        {...formProps}
                        label="account"
                        field="account"
                        initialValue={data.account}
                        required
                        maxLength={255}
                    />
                    <FormElement
                        {...formProps}
                        type="password"
                        label="密码"
                        field="password"
                        initialValue={data.password}
                        required
                        maxLength={255}
                    />
                    <FormElement
                        {...formProps}
                        label="用户名"
                        field="name"
                        initialValue={data.name}
                        maxLength={20}
                    />
                    <FormElement
                        {...formProps}
                        type="mobile"
                        label="手机"
                        field="mobile"
                        initialValue={data.mobile}
                        maxLength={20}
                    />
                    <FormElement
                        {...formProps}
                        type="email"
                        label="邮箱"
                        field="email"
                        initialValue={data.email}
                        required
                        maxLength={50}
                    />
                    <FormElement
                        {...formProps}
                        type="switch"
                        label="是否启用"
                        field="enabled"
                        initialValue={data.enabled}
                    />
                    <FormElement
                        {...formProps}
                        type="switch"
                        label="是否删除"
                        field="is_deleted"
                        initialValue={data.is_deleted}
                        required
                    />
                    <FormElement
                        {...formProps}
                        type="date"
                        label="创建时间"
                        field="created_at"
                        initialValue={data.created_at}
                        required
                    />
                    <FormElement
                        {...formProps}
                        type="date"
                        label="更新时间"
                        field="updated_at"
                        initialValue={data.updated_at}
                        required
                    />
                </Form>
            </ModalContent>
        );
    }
}
