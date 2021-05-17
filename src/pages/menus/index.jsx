import {useEffect, useState, useMemo} from 'react';
import {Menu, Button, Space, Form, Empty} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {PageContent, FormItem} from '@ra-lib/components';
import {convertToTree} from '@ra-lib/util';
import styles from './style.less';

export default config({
    path: '/menus',
})(function Menus(props) {
        const [selectedKey, setSelectedKey] = useState(null);
        const [title, setTitle] = useState('添加顶级');
        const {data: menus = [], run: fetchMenus} = props.ajax.useGet('/menus');
        const {run: saveMenu} = props.ajax.usePost('/menus');
        const {run: updateMenu} = props.ajax.usePut('/menus');
        const {run: saveActions} = props.ajax.usePost('/actions');
        const [menuForm] = Form.useForm();
        const [actionForm] = Form.useForm();

        async function handleMenuSubmit(values) {
            console.log(values);

            if (values.id) {
                await updateMenu(values);
                await fetchMenus();
            } else {
                const res = await saveMenu(values);

                await fetchMenus();
                // 新增之后，选中刚新增的菜单
                handleClick({key: res.id});
            }
        }

        async function handleActionSubmit(values) {
            await saveActions(values);

            await fetchMenus();
        }

        function handleClick({key}) {
            setSelectedKey(key);
            const menuData = menus.find(item => item.id === key);

            menuForm.resetFields();
            menuForm.setFieldsValue(menuData);
            setTitle('修改菜单');

            actionForm.resetFields();

            actionForm.setFieldsValue({
                menuId: key,
                actions: [],
            });
        }

        function handleAddTop() {
            menuForm.resetFields();
            setTitle('添加顶级');

            actionForm.setFieldsValue({
                menuId: undefined,
                actions: [],
            });
        }

        function handleAddSub() {
            menuForm.resetFields();
            menuForm.setFieldsValue({parentId: selectedKey});
            setTitle('添加子级');

            actionForm.setFieldsValue({
                menuId: undefined,
                actions: [],
            });
        }

        const menuItems = useMemo(() => {
            const menuTreeData = convertToTree(menus);
            const loop = (nodes) => nodes.map(item => {
                let {id, icon, title, children} = item;

                if (children && children.length) {
                    return (
                        <Menu.SubMenu
                            key={id}
                            title={title}
                            icon={icon}
                            onTitleClick={handleClick}
                        >
                            {loop(children)}
                        </Menu.SubMenu>
                    );
                }
                return (
                    <Menu.Item key={id} icon={icon}>
                        {title}
                    </Menu.Item>
                );
            });

            return loop(menuTreeData);
            // eslint-disable-next-line
        }, [menus]);

        useEffect(() => {
            (async () => {
                await fetchMenus();
            })();
            // eslint-disable-next-line
        }, []);

        const layout = {
            labelCol: {flex: '90px'},
        };

        return (
            <PageContent fitHeight className={styles.root}>
                <div className={styles.menu}>
                    <Space className={styles.menuTop}>
                        <Button type="primary" onClick={handleAddTop}>添加顶级</Button>
                        <Button disabled={!selectedKey} onClick={handleAddSub}>添加子级</Button>
                    </Space>
                    <div className={styles.menuContent}>
                        <Menu
                            mode="inline"
                            selectable
                            selectedKeys={[selectedKey]}
                            onClick={handleClick}
                        >
                            {menuItems}
                        </Menu>
                    </div>
                </div>
                <div className={styles.edit}>
                    <h2>{title}</h2>
                    <Form
                        form={menuForm}
                        onFinish={handleMenuSubmit}
                    >
                        <FormItem name="parentId" hidden/>
                        <FormItem name="id" hidden/>
                        <FormItem
                            {...layout}
                            label="标题"
                            name="title"
                            required
                            tooltip="菜单标题"
                        />
                        <FormItem
                            {...layout}
                            label="基础路径"
                            name="basePath"
                            tooltip="所有子菜单将以此路径为前缀"
                        />
                        <FormItem
                            {...layout}
                            label="路径"
                            name="path"
                            tooltip="菜单路径，如果第三方网站，请指定目标"
                        />
                        <FormItem
                            {...layout}
                            label="目标"
                            type="radio-button"
                            name="target"
                            initialValue={''}
                            options={[
                                {value: '', label: '无'},
                                {value: 'iframe', label: '内嵌'},
                                {value: '_self', label: '当前窗口'},
                                {value: '_blank', label: '新开窗口'},
                            ]}
                            tooltip="指定目标之后，将以第三方网站方式打开"
                        />
                        <FormItem
                            {...layout}
                            type="number"
                            label="排序"
                            name="order"
                            tooltip="越大越靠前"
                        />
                        <FormItem>
                            <Space style={{paddingLeft: layout.labelCol.flex}}>
                                <Button type="primary" htmlType="submit">保存</Button>
                            </Space>
                        </FormItem>
                    </Form>
                </div>
                <div className={styles.action}>
                    <h2>功能列表</h2>
                    <Form
                        form={actionForm}
                        onFinish={handleActionSubmit}
                    >
                        <FormItem name="menuId" hidden/>
                        <FormItem shouldUpdate noStyle>
                            {({getFieldValue}) => {
                                const menuId = getFieldValue('menuId');

                                if (!menuId) return <Empty style={{marginTop: 100}} description="请选择或保存新增菜单"/>;

                                return (
                                    <>
                                        <Form.List name="actions">
                                            {(fields, {add, remove}) => (
                                                <>
                                                    {fields.map(({key, name}) => {
                                                        return (
                                                            <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
                                                                <FormItem
                                                                    hidden
                                                                    name={[name, 'id']}
                                                                />
                                                                <FormItem
                                                                    name={[name, 'title']}
                                                                    placeholder="名称"
                                                                    rules={[{required: true, message: '请输入名称！'}]}
                                                                />
                                                                <FormItem
                                                                    name={[name, 'code']}
                                                                    placeholder="编码"
                                                                    rules={[{required: true, message: '请输入编码！'}]}
                                                                />
                                                                <MinusCircleOutlined style={{color: 'red'}} onClick={() => remove(name)}/>
                                                            </Space>
                                                        );
                                                    })}
                                                    <FormItem>
                                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                            新增编码
                                                        </Button>
                                                    </FormItem>
                                                </>
                                            )}
                                        </Form.List>
                                        <Space style={{display: 'flex', justifyContent: 'center'}}>
                                            <Button type="primary" htmlType="submit">保存</Button>
                                        </Space>
                                    </>
                                );
                            }}
                        </FormItem>
                    </Form>
                </div>
            </PageContent>
        );
    },
);
