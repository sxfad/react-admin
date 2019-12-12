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
        fullScreen: false,
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

    // 节流校验写法 如果同一个页面多次调用，必须传递key参数
    userNameExist = (key = 'userNameExit', prevValue, message = '用户名重复') => {
        if (!this[key]) this[key] = _.debounce((rule, value, callback) => {
            if (!value) return callback();
            if (prevValue && value === prevValue) return callback();

            if (value === '22') return callback(message);

            console.log('组件内节流发请求');
            return callback();
        }, 500);

        return {validator: this[key]};
    };

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
                    <Form onSubmit={this.handleSubmit}>
                        {isEdit ? <FormElement type="hidden" field="id" initialValue={data.id}/> : null}
                        <FormRow>
                            <FormElement
                                {...formElementProps}
                                width={300}
                                label="名称"
                                labelTip="label中的提示信息"
                                tip="显示出来的提示信息"
                                field="name"
                                initialValue={data.name}
                                required
                                rules={[
                                    validator.noSpace(),
                                    validator.userNameExist('name1'),
                                    this.userNameExist('nam2'),
                                ]}
                            />
                            <FormElement
                                {...formElementProps}
                                label="年龄"
                                field="age"
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
                                    validator.userNameExist('name2'),
                                    this.userNameExist('name2'),
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
                                // validator.userNameExist(),
                                // {validator: this.userNameExist}
                            ]}
                        />
                        <div style={{height: 1000, width: 100, background: 'red'}}/>
                    </Form>
                </PageContent>
            </ModalContent>
        );
    }
}

