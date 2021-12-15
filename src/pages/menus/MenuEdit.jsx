import { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Form, Modal, Space, Tabs, Popconfirm } from 'antd';
import json5 from 'json5';
import { FormItem, Content, useHeight, useDebounceValidator } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';
import options from 'src/options';
import styles from './style.less';

const menuTargetOptions = options.menuTarget;

const TabPane = Tabs.TabPane;

export default config()(function MenuEdit(props) {
    const { isAdd, selectedMenu, onSubmit, onValuesChange } = props;

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [addTabKey, setAddTabKey] = useState('1');
    const [textAreaHeight] = useHeight(null, 285);
    const contentRef = useRef(null);

    const hasSelectedMenu = selectedMenu && Object.keys(selectedMenu).length;
    const isAddTop = isAdd && !hasSelectedMenu;
    const isAddSub = isAdd && hasSelectedMenu;
    const title = (() => {
        if (isAddTop) return WITH_SYSTEMS ? '添加应用' : '添加顶级';

        return isAddSub ? '添加菜单' : '修改菜单';
    })();

    const { run: deleteMenu } = props.ajax.useDel('/menu/:id', null, { setLoading });
    const { run: saveMenu } = props.ajax.usePost('/menu/addMenu', null, { setLoading });
    const { run: branchSaveMenu } = props.ajax.usePost('/menu/addSubMenus', null, { setLoading });
    const { run: updateMenu } = props.ajax.usePost('/menu/updateMenuById', null, { setLoading });
    const { run: fetchMenuByName } = props.ajax.useGet('/menu/getOneMenu');
    const { run: saveRole } = props.ajax.usePost('/role/addRole', null, { setLoading });

    // 表单回显
    useEffect(() => {
        form.resetFields();
        let initialValues = { ...selectedMenu, order: selectedMenu?.ord };
        if (isAddTop) initialValues = { target: 'qiankun' };
        if (isAddSub)
            initialValues = {
                target: 'menu',
                parentId: selectedMenu.id,
                systemId: selectedMenu.systemId,
            };

        form.setFieldsValue(initialValues);
    }, [form, isAdd, isAddTop, isAddSub, selectedMenu]);

    const handleSubmit = useCallback(
        async (values) => {
            if (loading) return;

            const params = {
                ...values,
                type: 1, // 菜单
                sort: values.order,
                ord: values.order,
            };

            if (isAdd) {
                if (isAddSub && addTabKey === '2') {
                    let { menus, parentId } = values;

                    try {
                        menus = json5.parse(menus);
                    } catch (e) {
                        return Modal.error({
                            title: '温馨提示',
                            content: '批量添加的菜单数据有误，请修正后保存！',
                        });
                    }

                    const params = { menus, parentId };
                    const res = await branchSaveMenu(params);
                    const { id } = res;
                    onSubmit && onSubmit({ id, isAdd: true });
                } else {
                    const res = await saveMenu(params);
                    const { id } = res;
                    onSubmit && onSubmit({ ...params, id, isAdd: true });

                    // 有系统的概念，并且是添加顶级，创建一个系统管理员
                    if (WITH_SYSTEMS && isAddTop) {
                        await saveRole({
                            systemId: id,
                            name: '系统管理员',
                            enabled: true,
                            remark: '拥有当前子系统所有权限',
                            type: 2,
                        });
                    }
                }
            } else {
                await updateMenu(params);
                onSubmit && onSubmit({ ...params, isUpdate: true });
            }
        },
        [addTabKey, branchSaveMenu, isAdd, isAddSub, isAddTop, loading, onSubmit, saveMenu, saveRole, updateMenu],
    );

    const checkName = useDebounceValidator(async (rule, value) => {
        if (!value) return;

        const menu = await fetchMenuByName({ name: value });
        if (!menu) return;

        const id = form.getFieldValue('id');
        const menuId = `${menu.id}`;
        if (isAdd && menu.name === value) throw Error('注册名称不能重复！');
        if (!isAdd && menuId !== id && menu.name === value) throw Error('注册名称不能重复！');
    });

    const handleDelete = useCallback(async () => {
        const id = selectedMenu?.id;
        await deleteMenu({ id });

        onSubmit && onSubmit({ id, isDelete: true });
    }, [deleteMenu, onSubmit, selectedMenu?.id]);

    const layout = {
        labelCol: { flex: '100px' },
    };

    return (
        <Form
            className={styles.pane}
            name={`menu-form`}
            form={form}
            onFinish={handleSubmit}
            onValuesChange={onValuesChange}
            initialValues={{ enabled: true }}
        >
            <h3 className={styles.title}>{title}</h3>
            <Content ref={contentRef} loading={loading} className={styles.content}>
                {isAddSub ? (
                    <Tabs activeKey={addTabKey} onChange={(key) => setAddTabKey(key)}>
                        <TabPane key="1" tab="单个添加" />
                        <TabPane key="2" tab="批量添加" />
                    </Tabs>
                ) : null}
                <FormItem name="id" hidden />
                <FormItem name="parentId" hidden />
                {addTabKey === '1' ? (
                    <>
                        <FormItem
                            {...layout}
                            label="类型"
                            type="select"
                            name="target"
                            options={menuTargetOptions}
                            tooltip="指定类型之后，将以乾坤子项目或第三方网站方式打开"
                            required
                            getPopupContainer={() => contentRef.current}
                        />
                        <FormItem {...layout} label="标题" name="title" required tooltip="菜单标题" />
                        <FormItem {...layout} type="number" label="排序" name="order" tooltip="降序，越大越靠前" />
                        <FormItem {...layout} label="路径" name="path" tooltip="菜单路径或第三方网站地址" />
                        <FormItem
                            {...layout}
                            type="switch"
                            label="启用"
                            name="enabled"
                            checkedChildren="启"
                            unCheckedChildren="禁"
                            tooltip="是否启用"
                        />
                        <FormItem shouldUpdate noStyle>
                            {({ getFieldValue }) => {
                                const target = getFieldValue('target');
                                if (target === 'qiankun') {
                                    return (
                                        <>
                                            <FormItem
                                                {...layout}
                                                label="注册名称"
                                                tooltip="要与子应用package.json中声明的name属性相同，唯一不可重复"
                                                name="name"
                                                rules={[
                                                    { validator: checkName },
                                                    {
                                                        pattern: /^[0-9A-Za-z_-]+$/,
                                                        message: '只允许英文大小写、_、-！',
                                                    },
                                                ]}
                                                required
                                            />
                                            <FormItem
                                                {...layout}
                                                label="入口地址"
                                                tooltip="http(s)开头的网址"
                                                name="entry"
                                                rules={[
                                                    {
                                                        validator: (rule, value) => {
                                                            if (value && !value.startsWith('http'))
                                                                return Promise.reject('请输入正确的入口地址！');
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                ]}
                                                noSpace
                                                required
                                            />
                                        </>
                                    );
                                }

                                return (
                                    <FormItem
                                        {...layout}
                                        label="基础路径"
                                        name="basePath"
                                        tooltip="所有其子菜单路径将以此为前缀"
                                    />
                                );
                            }}
                        </FormItem>
                    </>
                ) : (
                    <FormItem
                        labelCol={{ flex: 0 }}
                        type="textarea"
                        name="menus"
                        rows={16}
                        rules={[{ required: true, message: '请输入菜单数据！' }]}
                        style={{ height: textAreaHeight }}
                        placeholder={`批量添加子菜单，结构如下：
[
    {id: 'system', title: '系统管理', order: 900},
    {id: 'user', parentId: 'system', title: '用户管理', path: '/users', order: 900},
    {id: 'menus', parentId: 'system', title: '菜单管理', path: '/menus', order: 900},
    {id: 'role', parentId: 'system', title: '角色管理', path: '/roles', order: 900},
    {
        id: 'demo', parentId: 'system', title: '测试子应用',
        target: 'qiankun',

        name: 'react-admin',
        entry: 'http://localhost:3000',

        order: 850,
    },
]
                            `}
                    />
                )}
            </Content>
            <Space className={styles.footerAction}>
                {!isAdd ? (
                    <Popconfirm title={`您确定删除「${selectedMenu?.title}」？`} onConfirm={handleDelete}>
                        <Button loading={loading} danger>
                            删除
                        </Button>
                    </Popconfirm>
                ) : null}
                <Button loading={loading} type="primary" htmlType="submit">
                    保存
                </Button>
            </Space>
        </Form>
    );
});
