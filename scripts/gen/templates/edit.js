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
import {FormElement, FormRow} from 'src/library/components';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';

@config({
    title: props => props.match.params.id === ':id' ? '添加' : '修改',
    path: '${base.path}/_/edit/:id',
    ajax: true,
})
export default class Edit extends Component {
    state = {
        loading: false, // 页面加载loading
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
        this.props.ajax.${base.ajax.detail.method}(\`${base.ajax.detail.url.replace('{id}', '${id}')}\`)
            .then(res => {
                this.form.setFieldsValue(res);
            })
            .finally(() => this.setState({loading: false}));
    };

    handleSubmit = (values) => {
        if (this.state.loading) return;

        const {isEdit} = this.state;
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
    };

    render() {
        const {loading, isEdit} = this.state;
        const formProps = {
            labelWidth: 100,
            width: '50%',
        };

        return (
            <PageContent loading={loading}>
                <Form
                    ref={form => this.form = form}
                    onFinish={this.handleSubmit}
                >
                    {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                    <FormRow>
                        ${forms.map(item => `<FormElement
                            {...formProps}
                            ${item.type !== 'input' ? `type="${item.type}"` : DELETE_THIS_LINE}
                            label="${item.label}"
                            name="${item.field}"
                            ${item.required ? 'required' : DELETE_THIS_LINE}
                            ${item.maxLength ? `maxLength={${item.maxLength}}` : DELETE_THIS_LINE}
                            ${WITH_OPTIONS_TYPE.includes(item.type) ? `options={[
                                {value: '1', label: '选项1'},
                                {value: '2', label: '选项2'},
                            ]}` : DELETE_THIS_LINE}
                        />`).join('\n                        ')}
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
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
