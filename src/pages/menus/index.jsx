import { useEffect, useState, useMemo, useCallback } from 'react';
import { Menu, Button, Space, Empty } from 'antd';
import { PageContent, confirm, convertToTree, sort, findNextNode } from '@ra-lib/admin';
import config from 'src/commons/config-hoc';
import { WITH_SYSTEMS } from 'src/config';
import MenuEdit from './MenuEdit';
import ActionEdit from './ActionEdit';
import theme from 'src/theme.less';
import s from './style.less';

export default config({
    path: '/menus',
})(function MenuManager(props) {
    const [isAdd, setIsAdd] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [hasUnSaveMenu, setHasUnSaveMenu] = useState(false);
    const [hasUnSaveAction, setHasUnSaveAction] = useState(false);
    const {
        loading,
        data: menus = [],
        run: fetchMenus,
    } = props.ajax.useGet('/menu/queryMenus', null, {
        formatResult: (res) => {
            return (res || [])
                .map((item, index, arr) => {
                    const actions = arr.filter((it) => it.type === 2 && it.parentId === item.id);
                    return {
                        ...item,
                        id: '' + item.id,
                        parentId: item.parentId ? '' + item.parentId : item.parentId,
                        order: item.order ?? item.sort ?? item.ord,
                        actions,
                    };
                })
                .filter((item) => item.type === 1);
        },
    });

    const checkUnSave = useCallback(
        async (showTip = true) => {
            if (showTip && hasUnSaveMenu) await confirm('菜单有未保存数据，是否放弃？');
            setHasUnSaveMenu(false);

            if (showTip && hasUnSaveAction) await confirm('功能列表有未保存数据，是否放弃？');
            setHasUnSaveAction(false);
        },
        [hasUnSaveMenu, hasUnSaveAction],
    );

    const handleClick = useCallback(
        async ({ key }, showTip = true) => {
            await checkUnSave(showTip);

            const menuData = menus.find((item) => item.id === key);
            setSelectedMenu(menuData);
            setIsAdd(false);
        },
        [checkUnSave, menus],
    );

    const [menuItems, menuTreeData] = useMemo(() => {
        const menuTreeData = convertToTree(sort(menus, (a, b) => b.order - a.order));
        const loop = (nodes) =>
            nodes.map((item) => {
                let { id, icon, title, children } = item;

                if (children && children.length) {
                    return (
                        <Menu.SubMenu
                            key={id}
                            title={
                                <span
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        await handleClick({ key: id });
                                    }}
                                >
                                    {title}
                                </span>
                            }
                            icon={icon}
                            className={selectedMenu?.id === id ? `${theme.antPrefix}-menu-item-selected` : ''}
                            data-menu={item}
                        >
                            {loop(children)}
                        </Menu.SubMenu>
                    );
                }
                return (
                    <Menu.Item key={id} icon={icon} data-menu={item}>
                        {title}
                    </Menu.Item>
                );
            });

        return [loop(menuTreeData), menuTreeData];
        // eslint-disable-next-line
    }, [menus, selectedMenu, hasUnSaveMenu]);

    useEffect(() => {
        (async () => {
            await fetchMenus();
        })();
    }, [fetchMenus]);

    const handleMenuSubmit = useCallback(
        async (data) => {
            setHasUnSaveMenu(false);
            const { isAdd, isDelete, isUpdate, id } = data;

            await fetchMenus();

            if (isAdd) {
                setSelectedMenu({ ...selectedMenu });
            }

            if (isUpdate) {
            }

            if (isDelete) {
                const nextNode = findNextNode(menuTreeData, id);
                if (nextNode) {
                    await handleClick({ key: nextNode.id }, false);
                } else {
                    // 删没了
                    setSelectedMenu({});
                    setIsAdd(true);
                }
            }
        },
        [fetchMenus, handleClick, menuTreeData, selectedMenu],
    );

    const handleActionSubmit = useCallback(async () => {
        setHasUnSaveAction(false);

        await fetchMenus();
    }, [fetchMenus]);

    return (
        <PageContent loading={loading} fitHeight className={s.menuRoot}>
            <div className={s.menu}>
                <Space className={s.menuTop}>
                    <Button
                        type="primary"
                        onClick={async () => {
                            await checkUnSave();
                            setIsAdd(true);
                            setSelectedMenu(null);
                        }}
                    >
                        {WITH_SYSTEMS ? '添加应用' : '添加顶级'}
                    </Button>
                    <Button
                        disabled={!selectedMenu}
                        type="primary"
                        onClick={async () => {
                            await checkUnSave();
                            setIsAdd(true);
                        }}
                    >
                        添加子级
                    </Button>
                </Space>
                <div className={s.menuContent}>
                    {menus?.length ? (
                        <Menu
                            mode="inline"
                            selectable
                            selectedKeys={[selectedMenu?.id]}
                            onClick={(info) => handleClick(info)}
                        >
                            {menuItems}
                        </Menu>
                    ) : (
                        <Empty style={{ marginTop: 58 }} description="暂无数据" />
                    )}
                </div>
            </div>
            <MenuEdit
                isAdd={isAdd}
                selectedMenu={selectedMenu}
                onSubmit={handleMenuSubmit}
                onValuesChange={() => setHasUnSaveMenu(true)}
            />
            <ActionEdit
                isAdd={isAdd}
                selectedMenu={selectedMenu}
                onValuesChange={() => setHasUnSaveAction(true)}
                onSubmit={handleActionSubmit}
            />
        </PageContent>
    );
});
