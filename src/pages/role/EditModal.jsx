import {useState} from 'react';
import {Card, Row, Col, Form} from 'antd';
import config from 'src/commons/config-hoc';
import {ModalContent, FormItem, Content} from '@ra-lib/components';
import SystemSelect from 'src/pages/menus/SystemSelect';
import MenuTableSelect from 'src/pages/menus/MenuTableSelect';
import {v4 as uuid} from 'uuid';
import {IS_MOBILE} from 'src/config';

export default config({
    modal: {
        title: props => props.isEdit ? '编辑角色' : '创建角色',
        width: '70%',
        top: 50,
    },
})(function Edit(props) {
    const {record, isEdit, onOk} = props;
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    // 获取详情 data为表单回显数据
    const {data = {status: true}} = props.ajax.useGet(`role/detail?id=${record?.id}`, null, [], {
        setLoading,
        mountFire: isEdit, // 组件didMount时，只有编辑时才触发请求
        formatResult: res => {
            if (!res) return;
            const values = {
                ...res,
                systemId: window.parseInt(res.systemId, 10) || 0,
                status: res.status === '1',
                menuIds: (res.authorityId || '').split(','),
            };
            form.setFieldsValue(values);
        },
    });
    // 添加请求
    const {run: saveRole} = props.ajax.usePost('/role/add', null, {setLoading, successTip: '创建成功！'});
    // 更新请求
    const {run: updateRole} = props.ajax.usePost('/role/update', null, {setLoading, successTip: '修改成功！'});

    async function handleSubmit(values) {
        const params = {
            ...values,
            code: uuid(),
            status: values.status ? 1 : 0,
            authorityId: (values.menuIds || []).join(','),
        };

        if (isEdit) {
            await updateRole(params);
        } else {
            await saveRole(params);
        }

        onOk();
    }

    const layout = {labelCol: {flex: '100px'}};
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
                                    label="所属系统"
                                    name="systemId"
                                    showSearch
                                    required
                                >
                                    <SystemSelect/>
                                </FormItem>
                                <FormItem
                                    {...layout}
                                    label="角色名称"
                                    name="name"
                                    required
                                    noSpace
                                    maxLength={50}
                                />
                                <FormItem
                                    {...layout}
                                    type="switch"
                                    label="启用"
                                    name="status"
                                    valuePropName="checked"
                                    required
                                />
                                <FormItem
                                    {...layout}
                                    type="textarea"
                                    label="备注"
                                    name="remark"
                                    maxLength={250}
                                />
                            </Content>
                        </Card>
                    </Col>
                    <Col {...colLayout}>
                        <Card title="权限配置" bodyStyle={{padding: 0}}>
                            <FormItem
                                {...layout}
                                name="menuIds"
                            >
                                <MenuTableSelect fitHeight otherHeight={200}/>
                            </FormItem>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </ModalContent>
    );
});
