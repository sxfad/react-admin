import React, {useState, useEffect} from 'react';
import {Form, Row, Col} from 'antd';
import config from 'src/commons/config-hoc';
import {ModalContent, FormItem} from 'ra-lib';
import {useGet, usePost, usePut} from 'src/commons/ajax';

const formLayout = {
    labelCol: {
        flex: '100px',
    },
};

export default config({
    modal: {
        title: props => props.isEdit ? '修改用户' : '添加用户',
        width: 600,
    },
})(props => {
    const {isEdit, id, onOk} = props;
    const [form] = Form.useForm();
    const [data, setData] = useState({});
    const [loading, fetchUser] = useGet('/mock/users/:id');
    const [saving, saveUser] = usePost('/mock/users', {successTip: '添加成功！'});
    const [updating, updateUser] = usePut('/mock/users', {successTip: '添加成功！'});

    async function fetchData() {
        if (loading) return;

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
        (async () => {
            if (isEdit) await fetchData();
        })();
    }, []);

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
                {isEdit ? <FormItem {...formLayout} hidden name="id"/> : null}

                <Row>
                    <Col flex={1}>
                        <FormItem
                            {...formLayout}
                            label="用户名"
                            name="name"
                            required
                            noSpace
                        />
                    </Col>
                    <Col flex={1}>
                        <FormItem
                            {...formLayout}
                            label="真实姓名"
                            name="realName"
                            required
                        />
                    </Col>
                </Row>
                <FormItem
                    {...formLayout}
                    type="number"
                    label="年龄"
                    name="age"
                    required
                />
                <FormItem
                    {...formLayout}
                    type="select"
                    label="工作"
                    name="job"
                    options={[
                        {value: '1', label: '前端开发'},
                        {value: '2', label: '后端开发'},
                    ]}
                />
                <FormItem
                    {...formLayout}
                    type="select"
                    label="职位"
                    name="position"
                    options={[
                        {value: '1', label: '员工'},
                        {value: '2', label: 'CEO'},
                    ]}
                />
                <FormItem
                    {...formLayout}
                    type="select"
                    label="角色"
                    name="role"
                    mode="multiple"
                    showSearch
                    optionFilterProp='children'
                    options={[
                        {value: '1', label: '员工'},
                        {value: '2', label: 'CEO'},
                    ]}
                />
            </Form>
        </ModalContent>
    );
});


