import { useCallback, useMemo, useState } from 'react';
import { Form, Row, Col, Card, Button } from 'antd';
import { ModalContent, FormItem, Content, validateRules, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import RoleSelectTable from 'src/pages/role/RoleSelectTable';

export default config({
    modal: {
        title: (props) => {
            if (props?.record?.isDetail) return '查看用户';

            return props.isEdit ? '编辑用户' : '创建用户';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const { record, isEdit, onOk, onCancel } = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;

    const params = useMemo(() => {
        return { id: record?.id };
    }, [record]);

    // 编辑时，查询详情数据
    props.ajax.useGet('/user/getUserById', params, [params], {
        mountFire: isEdit,
        setLoading,
        formatResult: (res) => {
            if (!res) return;
            form.setFieldsValue(res);
        },
    });
    const { run: save } = props.ajax.usePost('/user/addUser', null, { setLoading, successTip: '创建成功！' });
    const { run: update } = props.ajax.usePost('/user/updateUserById', null, { setLoading, successTip: '修改成功！' });
    const { run: fetchUserByAccount } = props.ajax.useGet('/user/getOneUser');

    const handleSubmit = useCallback(
        async (values) => {
            const roleIds = values.roleIds?.filter((id) => !`${id}`.startsWith('systemId'));
            const params = {
                ...values,
                roleIds,
            };

            if (isEdit) {
                await update(params);
            } else {
                await save(params);
            }

            onOk();
        },
        [isEdit, update, save, onOk],
    );

    const checkAccount = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const user = await fetchUserByAccount({ account: value });
        if (!user) return;

        const id = form.getFieldValue('id');
        if (isEdit && user.id !== id && user.account === value) throw Error('账号不能重复！');
        if (!isEdit && user.account === value) throw Error('账号不能重复！');
    });

    const disabled = isDetail;
    const layout = {
        labelCol: { flex: '100px' },
        disabled,
    };
    const colLayout = {
        xs: { span: 24 },
        sm: { span: 12 },
    };
    return (
        <Form form={form} name="roleEdit" onFinish={handleSubmit} initialValues={{ enabled: true }}>
            <ModalContent
                loading={loading}
                okText="保存"
                okHtmlType="submit"
                cancelText="重置"
                onCancel={() => form.resetFields()}
                footer={disabled ? <Button onClick={onCancel}>关闭</Button> : undefined}
            >
                {isEdit ? <FormItem hidden name="id" /> : null}
                <Row gutter={8}>
                    <Col {...colLayout}>
                        <Card title="基础信息">
                            <Content fitHeight otherHeight={160}>
                                <FormItem
                                    {...layout}
                                    label="账号"
                                    name="account"
                                    required
                                    noSpace
                                    rules={[{ validator: checkAccount }]}
                                />
                                <FormItem {...layout} label="密码" name="password" required noSpace />
                                <FormItem
                                    {...layout}
                                    type={'switch'}
                                    label="启用"
                                    name="enabled"
                                    checkedChildren="启"
                                    unCheckedChildren="禁"
                                    required
                                />
                                <FormItem {...layout} label="姓名" name="name" required noSpace />
                                <FormItem
                                    {...layout}
                                    label="邮箱"
                                    name="email"
                                    rules={[validateRules.email()]}
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="手机号"
                                    name="mobile"
                                    rules={[validateRules.mobile()]}
                                    required
                                    noSpace
                                />
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="角色配置" bodyStyle={{ padding: 0 }}>
                            <FormItem {...layout} name="roleIds">
                                <RoleSelectTable fitHeight otherHeight={200} getCheckboxProps={() => ({ disabled })} />
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </ModalContent>
        </Form>
    );
});
