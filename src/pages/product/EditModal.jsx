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
        this.props.ajax.get(`/products/${id}`)
            .then(res => {
                this.setState({data: res});

                // 不处理null，下拉框不显示placeholder
                Object.entries(res).forEach(([key, value]) => {
                    if (value === null) res[key] = undefined;
                });

                this.form.setFieldsValue(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.props;
        const successTip = isEdit ? '修改成功！' : '添加成功！';
        const ajaxMethod = isEdit ? this.props.ajax.put : this.props.ajax.post;
        const ajaxUrl = isEdit ? '/products' : '/products';

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
                    name="product-modal-edit"
                    initialValues={data}
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                >
                    {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                    <FormElement
                        {...formProps}
                        label="描述"
                        name="description"
                        maxLength={200}
                    />
                    <FormElement
                        {...formProps}
                        label="产品名称"
                        name="name"
                        required
                        maxLength={50}
                    />
                </Form>
            </ModalContent>
        );
    }
}
