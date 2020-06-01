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
export default class ${base.ModuleName}Edit extends Component {
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
        this.props.ajax.${base.ajax.detail.method}(\`${base.ajax.detail.url.replace('{id}', '${id}')}\`)
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

        const {isEdit} = this.state;
        const successTip = isEdit ? '修改成功！' : '添加成功！';
        const ajaxMethod = isEdit ? this.props.ajax.${base.ajax.modify.method} : this.props.ajax.${base.ajax.add.method};
        const ajaxUrl = isEdit ? '${base.ajax.modify.url}' : '${base.ajax.add.url}';

        this.setState({loading: true});
        ajaxMethod(ajaxUrl, values, {successTip})
            .then(() => {
                this.props.history.goBack();
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
                    name="${base.moduleName}-edit"
                    initialValues={data}
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
