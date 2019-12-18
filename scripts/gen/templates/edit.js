const DELETE_THIS_LINE = 'DELETE_THIS_LINE';
const WITH_OPTIONS_TYPE = ['select', 'radio-group', 'checkbox-group'];

/**
 * 获取编辑页面字符串
 */
module.exports = function (config) {
    const {
        base,
        forms,
    } = config;

    return `import React, {Component} from 'react';
import {Form, Button} from 'antd';
import {FormElement, FormRow} from '@/library/components';
import config from '@/commons/config-hoc';
import PageContent from '@/layouts/page-content';

@config({
    title: props => props.match.params.id === ':id' ? '添加' : '修改',
    path: '${base.path}/_/edit/:id',
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
        const {id} = this.props.match.params;
        const isEdit = id !== ':id';

        this.setState({isEdit});

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
                        ${forms.map(item => `<FormElement
                            {...formProps}
                            ${item.type !== 'input' ? `type="${item.type}"` : DELETE_THIS_LINE}
                            label="${item.label}"
                            field="${item.field}"
                            initialValue={data.${item.field}}
                            ${item.required ? 'required' : DELETE_THIS_LINE}
                            ${item.maxLength ? `maxLength={${item.maxLength}}` : DELETE_THIS_LINE}
                            ${WITH_OPTIONS_TYPE.includes(item.type) ? `options={[
                                {value: '1', label: '选项1'},
                                {value: '2', label: '选项2'},
                            ]}` : DELETE_THIS_LINE}
                        />`).join('\n                        ')}
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
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
