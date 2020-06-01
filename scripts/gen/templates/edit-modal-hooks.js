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

    const {ModuleName, moduleName} = base;

    return `import React, {useState, useEffect} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';
import {useGet, usePost, usePut} from 'src/commons/ajax';

export default config({
    modal: props => props.isEdit ? '修改' : '添加',
})(props => {
    const [data, setData] = useState({});
    const {isEdit, id, onOk} = props;
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

        onOk && onOk();
    }

    useEffect(() => {
        if (isEdit) fetchData();
    }, []);

    const formProps = {
        labelWidth: 100,
    };
    const modalLoading = loading || saving || updating;
    return (
        <ModalContent
            loading={modalLoading}
            okText="保存"
            cancelText="重置"
            onOk={() => form.submit()}
            onCancel={() => form.resetFields()}
        >
            <Form
                name="${moduleName}-modal-edit"
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
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
            </Form>
        </ModalContent>
    );
});
`.split('\n').filter(item => item.trim() !== DELETE_THIS_LINE).join('\n');
};
