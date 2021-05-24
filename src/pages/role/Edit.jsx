import {useEffect, useState} from 'react';
import {Form} from 'antd';
import config from 'src/commons/config-hoc';
import {ModalContent, FormItem} from '@ra-lib/components';

export default config({
    modal: props => {
        console.log('role modal', props);
        return props.isEdit ? '编辑角色' : '创建角色';
    },
})(function Edit(props) {
    const {id, isEdit, onOk} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const {run: fetchData} = props.ajax.useGet(`/roles/${id}`, null, {
        setLoading,
        formatResult: res => {
            if (!res) return;
            form.setFieldsValue(res);
        },
    });
    const {run: save} = props.ajax.usePost('/roles', null, {setLoading, successTip: '创建成功！'});
    const {run: update} = props.ajax.usePut('/roles', null, {setLoading, successTip: '修改成功！'});

    async function handleSubmit(values) {
        console.log(JSON.stringify(values, null, 4));

        if (isEdit) {
            await update(values);
        } else {
            await save(values);
        }

        onOk();
    }

    useEffect(() => {
        isEdit && fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const layout = {labelCol: {flex: '100px'}};
    return (
        <ModalContent
            loading={loading}
            okText="保存"
            onOk={() => form.submit()}
            cancelText="重置"
            onCancel={() => form.resetFields()}
        >
            <Form
                form={form}
                name="roleEdit"
                onFinish={handleSubmit}
            >
                {isEdit ? <FormItem hidden name="id" initialValue={id}/> : null}
                <FormItem
                    {...layout}
                    label="角色名称"
                    name="name"
                    required
                    noSpace
                />
                <FormItem
                    {...layout}
                    type="textarea"
                    label="角色描述"
                    name="description"
                    maxLength={50}
                />
            </Form>
        </ModalContent>
    );
});
