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

    const {ModuleName, moduleName} = base;

    return `import React, {useState, useEffect} from 'react';
import {Form, Button} from 'antd';
import {FormElement, FormRow} from 'src/library/components';
import config from 'src/commons/config-hoc';
import PageContent from 'src/layouts/page-content';
import {useGet, usePost, usePut} from 'src/commons/ajax';

export default config({
    title: props => props.match.params.id === ':id' ? '添加' : '修改',
    path: '/charts/_/edit/:id',
})(props => {
    const [data, setData] = useState({});
    const {isEdit, id} = props;
    const [form] = Form.useForm();
    const [loading, fetch${ModuleName}] = useGet('${base.ajax.detail.url}');
    const [saving, save${ModuleName}] = usePost('${base.ajax.add.url}', {successTip: '添加成功！'});
    const [updating, update${ModuleName}] = usePut('${base.ajax.modify.url}', {successTip: '修改成功！'});

    async function fetchData() {
        if (loading) return;

        const res = await fetch${ModuleName}(id);

        // 不处理null，下拉框不显示placeholder
        Object.entries(res).forEach(([key, value]) => {
            if (value === null) res[key] = undefined;
        });

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (saving || updating) return;

        await (isEdit ? update${ModuleName} : save${ModuleName})(values);

        this.props.history.goBack();
    }

    useEffect(() => {
        if (isEdit) fetchData();
    }, []);

    const formProps = {
        labelWidth: 100,
        width: '50%',
    };
    const pageLoading = loading || saving || updating;
    return (
        <PageContent loading={pageLoading}>
            <Form
                name="${moduleName}-edit"
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
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
                />`).join('\n                ')}
                </FormRow>
                <FormRow>
                    <FormElement {...formProps} layout label=" ">
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button onClick={() => form.resetFields()}>重置</Button>
                    </FormElement>
                </FormRow>
            </Form>
        </PageContent>
    );
});
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
