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
    const [ loading, fetchDepartmentUser ] = props.ajax.useGet('/departmentUsers/{id}');
    const [ saving, saveDepartmentUser ] = props.ajax.usePost('/departmentUsers', { successTip: '添加成功！' });
    const [ updating, updateDepartmentUser ] = props.ajax.usePut('/departmentUsers', { successTip: '修改成功！' });

    async function fetchData() {
        if (loading) return;

        const res = await fetchDepartmentUser(id);

        // 不处理null，下拉框不显示placeholder
        Object.entries(res).forEach(([ key, value ]) => {
            if (value === null) res[key] = undefined;
        });

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (saving || updating) return;

        await (isEdit ? updateDepartmentUser : saveDepartmentUser)(values);

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
                name="departmentUsers-modal-edit"
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                <FormElement
                    {...formProps}
                    label="用户"
                    name="userId"
                    maxLength={36}
                />
                <FormElement
                    {...formProps}
                    label="部门"
                    name="departmentId"
                />
                <FormElement
                    {...formProps}
                    type="switch"
                    label="是否是领导"
                    name="isLeader"
                />
                <FormElement
                    {...formProps}
                    label="排序"
                    name="order"
                />
            </Form>
        </ModalContent>
    );
});
