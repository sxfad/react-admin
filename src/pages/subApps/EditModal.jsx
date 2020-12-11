import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { FormElement, ModalContent } from 'ra-lib';
import config from 'src/commons/config-hoc';

export default config({
    modal: props => props.isEdit ? '修改' : '添加',
})(props => {
    const [ data, setData ] = useState({});
    const { isEdit, id, onOk } = props;
    const [ form ] = Form.useForm();
    const [ loading, fetchSubApp ] = props.ajax.useGet('/subApps/{id}');
    const [ saving, saveSubApp ] = props.ajax.usePost('/subApps', { successTip: '添加成功！' });
    const [ updating, updateSubApp ] = props.ajax.usePut('/subApps', { successTip: '修改成功！' });

    async function fetchData() {
        if (loading) return;

        const res = await fetchSubApp(id);

        // 不处理null，下拉框不显示placeholder
        Object.entries(res).forEach(([ key, value ]) => {
            if (value === null) res[key] = undefined;
        });

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (saving || updating) return;

        await (isEdit ? updateSubApp : saveSubApp)(values);

        onOk && onOk();
    }

    useEffect(() => {
        (async () => {
            if (isEdit) await fetchData();
        })();
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
                name="subApps-modal-edit"
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                <FormElement
                    {...formProps}
                    label="entry"
                    name="entry"
                    maxLength={200}
                />
                <FormElement
                    {...formProps}
                    label="activeRule"
                    name="activeRule"
                    maxLength={200}
                />
                <FormElement
                    {...formProps}
                    label="name"
                    name="name"
                    maxLength={500}
                />
                <FormElement
                    {...formProps}
                    label="description"
                    name="description"
                    maxLength={500}
                />
                <FormElement
                    {...formProps}
                    label="side"
                    name="side"
                />
            </Form>
        </ModalContent>
    );
});
