import React, {useState, useEffect} from 'react';
import {Form} from 'antd';
import {FormElement} from 'src/library/components';
import config from 'src/commons/config-hoc';
import {ModalContent} from 'src/library/components';
import {useGet, usePost, usePut} from 'src/commons/ajax';

export default config({
    modal: props => props.isEdit ? '修改用户' : '添加用户',
})(props => {
    const [data, setData] = useState({});
    const {isEdit, id, onOk} = props;
    const [form] = Form.useForm();
    const [loading, fetchUser] = useGet('/mock/users/:id');
    const [saving, saveUser] = usePost('/mock/users', {successTip: '添加成功！'});
    const [updating, updateUser] = usePut('/mock/users', {successTip: '添加成功！'});

    async function fetchData() {
        if (loading) return;
        console.log(id);

        const res = await fetchUser(id);

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (saving || updating) return;

        const ajaxMethod = isEdit ? updateUser : saveUser;
        await ajaxMethod(values);

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


