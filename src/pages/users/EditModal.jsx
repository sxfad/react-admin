import React, {Component} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

@config({
    ajax: true,
    modal: {
        title: props => props.isEdit ? '修改用户' : '添加用户',
    },
})
export default class EditModal extends Component {
    state = {
        loading: false, // 页面加载loading
        data: {},       // 回显数据
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
        this.props.ajax.get(`/mock/users/${id}`)
            .then(res => {
                this.setState({data: res});
                this.form.setFieldsValue(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.props;
        const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
        const successTip = isEdit ? '修改成功！' : '添加成功！';

        this.setState({loading: true});
        ajaxMethod('/mock/users', values, {successTip})
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
                        label="用户名"
                        name="name"
                        required
                        noSpace
                    />
                    <FormElement
                        {...formProps}
                        type="number"
                        label="年龄"
                        name="age"
                        required
                    />
                    <FormElement
                        {...formProps}
                        type="select"
                        label="工作"
                        name="job"
                        options={[
                            {value: '1', label: '前端开发'},
                            {value: '2', label: '后端开发'},
                        ]}
                    />
                    <FormElement
                        {...formProps}
                        type="select"
                        label="职位"
                        name="position"
                        options={[
                            {value: '1', label: '员工'},
                            {value: '2', label: 'CEO'},
                        ]}
                    />
                    <FormElement
                        {...formProps}
                        type="select"
                        mode="multiple"
                        showSearch
                        optionFilterProp='children'
                        label="角色"
                        name="role"
                        options={[
                            {value: '1', label: '员工'},
                            {value: '2', label: 'CEO'},
                        ]}
                    />

                </Form>
            </ModalContent>
        );
    }
}

