import { useState, useEffect, useCallback } from 'react';
import { Button, Empty, Form, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormItem, Content } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import styles from './style.less';

export default config()(function ActionEdit(props) {
    const [form] = Form.useForm();
    const { isAdd, selectedMenu, onSubmit, onValuesChange } = props;
    const [loading, setLoading] = useState(false);
    const { run: save } = props.ajax.usePost('/menu/updateSubActions', null, {
        setLoading,
        successTip: '功能保存成功！',
    });

    const handleSubmit = useCallback(
        async (values) => {
            const { actions } = values;
            const parentId = selectedMenu?.id;

            await save({ actions, parentId });

            onSubmit && onSubmit(actions);
        },
        [onSubmit, selectedMenu, save],
    );

    useEffect(() => {
        form.resetFields();

        if (!selectedMenu) return;

        form.setFieldsValue({ actions: selectedMenu?.actions });
    }, [selectedMenu, form]);

    return (
        <Form
            className={styles.pane}
            name={`action-form`}
            form={form}
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
        >
            <h3 className={styles.title}>功能列表</h3>
            <Content loading={loading} className={styles.content}>
                {isAdd ? (
                    <Empty style={{ marginTop: 50 }} description="请选择或保存新增菜单" />
                ) : (
                    <Form.List name="actions">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name }) => {
                                    return (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <FormItem hidden name={[name, 'id']} />
                                            <FormItem
                                                type="switch"
                                                name={[name, 'enabled']}
                                                initialValue={true}
                                                checkedChildren="启"
                                                unCheckedChildren="禁"
                                            />
                                            <FormItem
                                                name={[name, 'title']}
                                                placeholder="名称"
                                                rules={[{ required: true, message: '请输入名称！' }]}
                                            />
                                            <FormItem
                                                name={[name, 'code']}
                                                placeholder="编码"
                                                rules={[{ required: true, message: '请输入编码！' }]}
                                            />
                                            <MinusCircleOutlined
                                                style={{ color: 'red' }}
                                                onClick={() => remove(name)}
                                            />
                                        </Space>
                                    );
                                })}
                                <FormItem>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        新增编码
                                    </Button>
                                </FormItem>
                            </>
                        )}
                    </Form.List>
                )}
            </Content>
            <Space className={styles.footerAction}>
                <Button loading={loading} disabled={isAdd} type="primary" htmlType="submit">
                    保存
                </Button>
            </Space>
        </Form>
    );
});
