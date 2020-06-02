import React, {useState, useEffect} from 'react';
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
    const [loading, fetchChart] = useGet('/charts/{id}');
    const [saving, saveChart] = usePost('/charts', {successTip: '添加成功！'});
    const [updating, updateChart] = usePut('/charts', {successTip: '修改成功！'});

    async function fetchData() {
        if (loading) return;

        const res = await fetchChart(id);

        // 不处理null，下拉框不显示placeholder
        Object.entries(res).forEach(([key, value]) => {
            if (value === null) res[key] = undefined;
        });

        setData(res || {});
        form.setFieldsValue(res || {});
    }

    async function handleSubmit(values) {
        if (saving || updating) return;

        await (isEdit ? updateChart : saveChart)(values);

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
                name="chart-modal-edit"
                form={form}
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormElement {...formProps} type="hidden" name="id"/> : null}
                <FormElement
                    {...formProps}
                    label="图标标题"
                    name="title"
                    maxLength={50}
                />
                <FormElement
                    {...formProps}
                    label="type"
                    name="type"
                    maxLength={20}
                />
                <FormElement
                    {...formProps}
                    type="textarea"
                    label="描述"
                    name="description"
                    maxLength={255}
                />
                <FormElement
                    {...formProps}
                    label="消息标识"
                    name="messageToken"
                    required
                    maxLength={50}
                />
                <FormElement
                    {...formProps}
                    label="纵轴显示标签个数"
                    name="valueTickCount"
                />
                <FormElement
                    {...formProps}
                    label="横轴系显示标签个数"
                    name="labelTickCount"
                />
            </Form>
        </ModalContent>
    );
});
