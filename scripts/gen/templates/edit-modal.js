const DELETE_THIS_LINE = 'DELETE_THIS_LINE';
const WITH_OPTIONS_TYPE = ['select', 'radio-group', 'checkbox-group'];
/**
 * 获取弹框编辑页面字符串
 */
module.exports = function (config) {
    const {
        base,
        forms,
    } = config;

    return `import React, {Component} from 'react';
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
        this.props.ajax.${base.ajax.detail.method}(\`${base.ajax.detail.url.replace('{id}', '${id}')}\`)
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
            const ajaxMethod = isEdit ? this.props.ajax.${base.ajax.modify.method} : this.props.ajax.${base.ajax.add.method};
            const ajaxUrl = isEdit ? '${base.ajax.modify.url}' : '${base.ajax.add.url}';

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
                    ${forms.map(item => `<FormElement
                        {...formProps}
                        ${item.type !== 'input' ? `type="${item.type}"` : DELETE_THIS_LINE}
                        label="${item.label}"
                        field="${item.field}"
                        ${item.required ? 'required' : DELETE_THIS_LINE}
                        ${WITH_OPTIONS_TYPE.includes(item.type) ? `options={[
                            {value: '1', label: '选项1'},
                            {value: '2', label: '选项2'},
                        ]}` : DELETE_THIS_LINE}
                    />`).join('\n                    ')}
                </Form>
            </ModalContent>
        );
    }
}

`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
