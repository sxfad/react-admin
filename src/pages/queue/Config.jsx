import React, {Component} from 'react';
import {Form, Button} from 'antd';
import {FormElement, FormRow} from '@/library/components';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';

@config({
    ajax: true,
})
@Form.create()
export default class Edit extends Component {
    state = {
        loading: false, // 页面加载loading
        data: {},       // 表单回显数据
        isEdit: false,  // 是否是编辑页面
    };

    componentDidMount() {
        const {id} = this.props;
        const isEdit = id !== undefined;

        this.setState({isEdit});

        if (isEdit) {
            this.fetchData();
        }
    }

    fetchData = () => {
        if (this.state.loading) return;

        const {id} = this.props;

        this.setState({loading: true});
        this.props.ajax.get(`/mock/users/${id}`)
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
            ajaxMethod('/mock/users', values, {successTip})
                .then(() => {
                    const {onOk} = this.props;
                    onOk && onOk();
                })
                .finally(() => this.setState({loading: false}));
        });
    };

    render() {
        const {form} = this.props;
        const {loading, data, isEdit} = this.state;
        const formProps = {
            labelWidth: 100,
            form,
            width: '50%',
        };

        return (
            <PageContent
                loading={loading}
            >
                <Form onSubmit={this.handleSubmit}>
                    {isEdit ? <FormElement {...formProps} type="hidden" field="id" initialValue={data.id}/> : null}
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="释放率"
                            field="rate"
                            initialValue={data.name}
                            required
                        />
                    </FormRow>

                    <FormRow>
                        <FormElement {...formProps} layout>
                            <Button type="primary" onClick={this.handleSubmit}>保存</Button>
                            <Button onClick={() => form.resetFields()}>重置</Button>
                        </FormElement>
                    </FormRow>
                </Form>
            </PageContent>
        );
    }
}

