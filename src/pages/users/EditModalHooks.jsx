import React, {useState, useEffect} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';

export default config({
    modal: props => props.isEdit ? '修改用户' : '添加用户',
})(props => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const {isEdit, id, ajax, onOk} = props;
    const [form] = Form.useForm();

    async function fetchData() {
        if (loading) return;

        setLoading(true);
        const res = await ajax.get(`/mock/users/${id}`);
        setLoading(false);

        if (res.$error) return;

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (loading) return;

        const ajaxMethod = isEdit ? ajax.put : ajax.post;
        const successTip = isEdit ? '修改成功！' : '添加成功！';

        setLoading(true);
        const res = await ajaxMethod('/mock/users', values, {successTip});
        setLoading(false);

        if (res.$error) return;

        onOk && onOk();
    }

    useEffect(() => {
        if (isEdit) fetchData();
    }, []);

    const formProps = {
        labelWidth: 100,
    };
    return (
        <ModalContent
            loading={loading}
            okText="保存"
            cancelText="重置"
            onOk={() => form.submit()}
            onCancel={() => form.resetFields()}
        >
            <Form
                form={form}
                onFinish={handleSubmit}
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
});


