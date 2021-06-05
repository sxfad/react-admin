import {useState} from 'react';
import {Form, Row, Col, Card, Button} from 'antd';
import {ModalContent, FormItem, Content} from '@ra-lib/components';
import {validateRules} from '@ra-lib/util';
import config from 'src/commons/config-hoc';
import RoleSelectTable from 'src/pages/role/RoleSelectTable';
import SystemSelect from 'src/pages/menus/SystemSelect';
import {IS_MOBILE} from 'src/config';

export default config({
    modal: {
        title: props => {
            if (props?.record?.isDetail) return '查看用户';

            return props.isEdit ? '编辑用户' : '创建用户';
        },
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const {record, isEdit, onOk, onCancel} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const isDetail = record?.isDetail;

    const {data = {status: true}} = props.ajax.useGet('/user/findById', {id: record?.id}, [], {
        mountFire: isEdit,
        setLoading,
        formatResult: res => {
            if (!res) return;
            const roleIdsArr = (res.roleId || '').split(',');
            const systemIdsArr = (res.systemId || '').split(',');
            const roleIds = [...roleIdsArr, ...systemIdsArr].filter(item => !!item).map(id => ({id: window.parseInt(id, 10)}));
            const systemIds = (res.systems || []).filter(item => item.admin).map(item => item.id);

            const values = {
                ...res,
                status: res.status === 'START',
                systemIds,
                roleIds,
            };
            form.setFieldsValue(values);
        },
    });
    const {run: save} = props.ajax.usePost('/user/add', null, {setLoading, successTip: '创建成功！'});
    const {run: update} = props.ajax.usePost('/user/update', null, {setLoading, successTip: '修改成功！'});

    async function handleSubmit(values) {
        const isAdminInSystems = (values.systemIds || []).join(',');
        let systemId = (values.roleIds || []).filter(item => item.isSystem).map(item => item.id);
        systemId = Array.from(new Set([...systemId, ...(values.systemIds || [])].map(item => window.parseInt(item, 10)))).join(',');

        const params = {
            ...values,
            status: values.status ? '1' : '0',
            isAdminInSystems,
            systemId,
            roleId: (values.roleIds || []).filter(item => !item.isSystem).map(item => item.id).join(','),
        };

        if (isEdit) {
            await update(params);
        } else {
            await save(params);
        }

        onOk();
    }

    const disabled = isDetail;
    const layout = {
        labelCol: {flex: '100px'},
        disabled,
    };
    const colLayout = {
        xs: {span: 24},
        sm: {span: 12},
    };
    return (
        <ModalContent
            loading={loading}
            okText="保存"
            onOk={() => form.submit()}
            cancelText="重置"
            onCancel={() => form.resetFields()}
            fullScreen={IS_MOBILE}
            footer={disabled ? <Button onClick={onCancel}>关闭</Button> : undefined}
        >
            <Form
                form={form}
                name="roleEdit"
                onFinish={handleSubmit}
                initialValues={data}
            >
                {isEdit ? <FormItem hidden name="id"/> : null}
                <Row gutter={8}>
                    <Col {...colLayout} style={{marginBottom: IS_MOBILE ? 16 : 0}}>
                        <Card title="基础信息">
                            <Content fitHeight={!IS_MOBILE} otherHeight={160}>
                                <FormItem
                                    {...layout}
                                    label="姓名"
                                    name="realName"
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="邮箱"
                                    name="email"
                                    disabled={isEdit}
                                    rules={[validateRules.email()]}
                                    required
                                    noSpace
                                />
                                <FormItem
                                    {...layout}
                                    label="手机号"
                                    name="phone"
                                    rules={[validateRules.mobile()]}
                                    required
                                    noSpace
                                />
                                {isEdit ? null : (
                                    <FormItem
                                        {...layout}
                                        label="密码"
                                        name="password"
                                        required
                                        noSpace
                                    />
                                )}
                                <FormItem
                                    {...layout}
                                    type="switch"
                                    label="启用"
                                    name="status"
                                    required
                                    valuePropName="checked"
                                />
                                <FormItem
                                    {...layout}
                                    label="系统管理员"
                                    name="systemIds"
                                >
                                    <SystemSelect
                                        disabled={disabled}
                                        showSearch
                                        mode="multiple"
                                    />
                                </FormItem>
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="角色配置" bodyStyle={{padding: 0}}>
                            <FormItem
                                {...layout}
                                name="roleIds"
                            >
                                <RoleSelectTable disabled={disabled} fullValue fitHeight={!IS_MOBILE} otherHeight={200}/>
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </ModalContent>
    );
});
