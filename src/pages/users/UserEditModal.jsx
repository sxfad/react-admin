import React, {Component, Fragment} from 'react';
import {Form, Button} from 'antd';
import _ from 'lodash';
import {FormElement, FormRow} from '@/library/components';
import PageContent from '@/layouts/page-content';
import config from '@/commons/config-hoc';
import validator from '@/library/utils/validation-rule';
import {ModalContent} from '@/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.id === null ? '添加用户' : '修改用户',
        fullScreen: true,
    }
})
@Form.create()
export default class EditModal extends Component {
    state = {
        loading: false,
        data: {}, // 表单回显数据
    };

    componentDidMount() {
        const {id} = this.props;

        const isEdit = id !== null;

        if (isEdit) {
            this.setState({loading: true});
            this.props.ajax.get(`/xxx/${id}`)
                .then(res => {
                    this.setState({data: res || {}});
                })
                .finally(() => this.setState({loading: false}));
        }
    }


    handleOk = () => {
        if (this.state.loading) return; // 防止重复提交

        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) return;

            const {id} = this.props;
            const isEdit = id !== null;

            if (isEdit) {
                this.setState({loading: true});
                this.props.ajax.put('/xxx', values, {successTip: '修改成功！'})
                    .then(() => {
                        const {onOk} = this.props;
                        onOk && onOk();
                    })
                    .finally(() => this.setState({loading: false}));
            } else {
                this.props.ajax.post('/xxx', values, {successTip: '添加成功！'})
                    .then(() => {
                        const {onOk} = this.props;
                        onOk && onOk();
                    })
                    .finally(() => this.setState({loading: false}));
            }
        });
    };


    // 节流校验写法
    userNameExist = _.debounce((rule, value, callback) => {
        console.log('节流发请求');
    }, 500);

    handleCancel = () => {
        const {onCancel} = this.props;
        onCancel && onCancel();
    };

    handleReset = () => {
        this.props.form.resetFields();
    };

    render() {
        const {id, form} = this.props;
        const isEdit = id !== null;
        const {loading, data} = this.state;
        const formElementProps = {
            labelWidth: 100,
            form,
        };

        return (
            <ModalContent
                loading={loading}
                footer={
                    <Fragment>
                        <Button onClick={this.handleOk} type="primary">保存</Button>
                        <Button onClick={this.handleReset}>重置</Button>
                        <Button onClick={this.handleCancel}>取消</Button>
                    </Fragment>
                }
            >
                <PageContent footer={false}>
                    <Form onSubmit={this.handleSubmit} style={{height: 1000}}>
                        {isEdit ? <FormElement type="hidden" field="id" initialValue={data.id}/> : null}
                        <FormRow>
                            <FormElement
                                {...formElementProps}
                                width={300}
                                label="名称"
                                field="name"
                                initialValue={data.name}
                                required
                                rules={[
                                    validator.noSpace(),
                                    validator.userNameExist(),
                                    {validator: this.userNameExist}
                                ]}
                            />
                            <FormElement
                                {...formElementProps}
                                label="年龄"
                                field="age"
                                initialValue={data.age}
                                required
                            />
                            <FormElement
                                {...formElementProps}
                                width={300}
                                label="名称"
                                field="name2"
                                initialValue={data.name}
                                required
                                rules={[
                                    validator.noSpace(),
                                    validator.userNameExist(),
                                    {validator: this.userNameExist}
                                ]}
                            />
                            <FormElement
                                {...formElementProps}
                                label="年龄"
                                field="age2"
                                initialValue={data.age}
                                required
                            />
                        </FormRow>
                        <FormRow>
                            <FormElement
                                {...formElementProps}
                                label="名称"
                                field="name3"
                                initialValue={data.name}
                                required
                                rules={[
                                    validator.noSpace(),
                                    validator.userNameExist(),
                                    {validator: this.userNameExist}
                                ]}
                            />
                        </FormRow>
                        <FormElement
                            {...formElementProps}
                            label="名称"
                            field="name4"
                            initialValue={data.name}
                            required
                            rules={[
                                validator.noSpace(),
                                validator.userNameExist(),
                                {validator: this.userNameExist}
                            ]}
                        />
                    </Form>
                </PageContent>
            </ModalContent>
        );
    }
}

