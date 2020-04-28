import React, {Component} from 'react';
import {Form, Button} from 'antd';
import {FormElement, FormRow} from 'src/library/components';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

@config({
    title: props => props.match.params.id === ':id' ? '添加' : '修改',
    path: '/user-center/_/edit/:id',
    ajax: true,
})
export default class Edit extends Component {
    state = {
        loading: false, // 页面加载loading
        data: {},       // 回显数据
        isEdit: false,  // 是否是编辑页面

    };

    componentDidMount() {
        const {id} = this.props.match.params;
        const isEdit = id !== ':id';

        this.setState({isEdit});

        if (isEdit) {
            this.fetchData();
        }
    }

    fetchData = () => {
        if (this.state.loading) return;

        const {id} = this.props.match.params;

        this.setState({loading: true});
        this.props.ajax.get(`/user-center/${id}`)
            .then(res => {
                this.setState({data: res});
                this.form.setFieldsValue(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.state;
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
        const {loading, data, isEdit} = this.state;
        const formProps = {
            labelWidth: 100,
            width: '50%',
        };

        return (
            <PageContent loading={loading}>
                <Form
                    name="user-center-edit"
                    initialValues={data}
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                >
                    {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                    <FormRow>
                        <FormElement
                            {...formProps}
                            label="用户名"
                            name="name"
                        />
                    </FormRow>
                    <FormRow>
                        <FormElement {...formProps} layout label=" ">
                            <Button type="primary" htmlType="submit">保存</Button>
                            <Button onClick={() => this.form.resetFields()}>重置</Button>
                        </FormElement>
                    </FormRow>
                </Form>
            </PageContent>
        );
    }
}
