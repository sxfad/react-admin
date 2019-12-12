import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement, FormRow} from '@/library/components';
import config from '@/commons/config-hoc';
import validator from '@/library/utils/validation-rule';
import {ModalContent} from '@/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改用户' : '添加用户',
    }
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
        this.props.ajax.get(`/users/${id}`)
            .then(res => {
                this.setState({data: res || {}});
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = () => {
        if (this.state.loading) return;

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;

            const {isEdit} = this.state;
            const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
            const successTip = isEdit ? '修改成功！' : '添加成功！';

            this.setState({loading: true});
            ajaxMethod('/users', values, {successTip})
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
                    {isEdit ? <FormElement type="hidden" field="id" initialValue={data.id}/> : null}
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="名称"
                            field="name"
                            initialValue={data.name}
                            required
                            noSpace
                            rules={[
                                validator.userNameExist(),
                            ]}
                        />
                        <FormElement
                            {...formProps}
                            type="number"
                            label="年龄"
                            field="age"
                            initialValue={data.age}
                            required
                        />
                    </FormRow>
                    <div style={{height: 1000, width: 100, background: 'red'}}/>
                </Form>
            </ModalContent>
        );
    }
}

