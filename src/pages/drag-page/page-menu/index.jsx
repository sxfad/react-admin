import React, {useEffect, useState} from 'react';
import {Menu, Input, Modal, Popover, Tooltip} from 'antd';
import {
    AppstoreOutlined,
    ArrowsAltOutlined,
    DeleteOutlined,
    ShrinkOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {convertToTree, renderNode, findGenerationNodes, findNode, removeNode} from '@ra-lib/admin';
import Pane from '../pane';
import {isMac} from 'src/pages/drag-page/util';

import styles from './style.less';
import LinkPoint from 'src/pages/drag-page/link-point';

const {SubMenu} = Menu;

export default config({
    router: true,
    query: true,
    connect: state => {
        return {
            menus: state.dragPage.menus,
            currentMenuKey: state.dragPage.currentMenuKey,
        };
    },
})(function ComponentTree(props) {
    let {
        currentMenuKey,
        menus,
        action: {dragPage: dragPageAction},
    } = props;
    const {projectId} = props.match.params;
    const {menuId} = props.query;

    if (!currentMenuKey) currentMenuKey = menuId

    const [menuData, setMenuData] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [allKeys, setAllKeys] = useState([]);
    const [draggingMenu, setDraggingMenu] = useState(null);

    const {run: saveMenu} = props.ajax.usePost(`/project/${projectId}/menus`);
    const {run: updateMenusOrder} = props.ajax.usePut(`/project/${projectId}/menusOrder`);
    const {run: updateMenu} = props.ajax.usePut(`/project/${projectId}/menus/:id`);
    const {run: deleteMenu} = props.ajax.useDel(`/project/${projectId}/menus/:id`);
    const {run: fetchMenus} = props.ajax.useGet(`/project/${projectId}/menus`);
    const {loading: pageLoading, run: fetchPage} = props.ajax.useGet(`/project/${projectId}/menus/:menuId/page`);

    useEffect(() => {
        const allKeys = [];
        menus.forEach(item => {
            item.key = `${item.id}`;
            item.parentKey = `${item.parentId}`;
            item.id = `${item.id}`;
            item.parentId = `${item.parentId}`;
            allKeys.push(item.key);
        });
        const menuData = convertToTree(menus);
        setMenuData(menuData);
        setAllKeys(allKeys);
        if (!openKeys?.length) {
            setOpenKeys(allKeys);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menus]);

    // 处理菜单选中、展开等状态
    useEffect(() => {
        if (!menuData?.length) return;

        let currentKey = currentMenuKey;

        const menu = findNode(menuData, currentMenuKey);

        if (!menu && menuData?.length) {
            currentKey = menuData[0]?.key;
            dragPageAction.setCurrentMenuKey(currentKey);
        }

        const {pathname} = props.history.location;
        const queryObj = props.query || {};
        queryObj.menuId = currentKey;

        const queryStr = Object.entries(queryObj).map(([key, value]) => `${key}=${value}`).join('&');
        props.history.replace(`${pathname}?${queryStr}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuData, currentMenuKey]);

    // 菜单选中改变，渲染页面
    useEffect(() => {
        if (pageLoading) return;
        const node = findNode(menuData, currentMenuKey);
        if (!node) return;

        (async () => {
            const page = await fetchPage(node.id);
            const {config} = page;
            dragPageAction.initDesignPage({pageConfig: config ? JSON.parse(config) : null});
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuData, currentMenuKey]);

    function handleClick(e, node) {
        e.stopPropagation();

        const {key} = node;
        setIsEdit(currentMenuKey === key);
        dragPageAction.setCurrentMenuKey(key);
    }

    async function handleMenuBlur(e, node) {
        setIsEdit(false);

        const {value} = e.target;
        const params = {
            id: node.id,
            text: value,
        };
        await updateMenu(params);

        node.text = value;
        setMenuData([...menuData]);
    }

    function handleMenuFocus(e) {
        e.target.select();
    }

    async function handleMenuKeyDown(e, node) {
        const {key, id, parentId} = node;
        const {ctrlKey, metaKey, shiftKey, keyCode} = e;
        const enterKey = keyCode === 13;
        let newMenu;

        // 添加子节点
        if ((ctrlKey || metaKey) && enterKey) {
            if (!openKeys.includes(key)) {
                openKeys.push(key);
                setOpenKeys([...openKeys]);
            }
            newMenu = {
                parentId: id,
                text: '新增页面',
            };

            if (!node?.children) node.children = [];

            node.children.push(newMenu);
        }

        // 添加兄弟节点
        if (shiftKey && enterKey) {
            newMenu = {
                parentId,
                text: '新增页面',
            };
            const parentCollection = parentId ? findNode(menuData, `${parentId}`).children : menuData;
            const index = parentCollection.findIndex(item => item.id === node.id);

            parentCollection.splice(index + 1, 0, newMenu);
        }

        if (newMenu) {
            node.text = e.target.value;

            // 先保存，创建page、获取id
            const savedMenu = await saveMenu(newMenu);
            newMenu.id = savedMenu.id;

            const menus = await updateMenus();

            dragPageAction.setMenus(menus);
            dragPageAction.setCurrentMenuKey(`${savedMenu.id}`);
            setIsEdit(true);
        } else if (enterKey) {
            await handleMenuBlur(e, node);
        }
    }

    async function handleDelete(e, node) {
        e.stopPropagation();
        Modal.confirm({
            title: '温馨提示',
            content: `您确定删除「${node.text}」吗`,
            onOk: async () => {
                const keys = (findGenerationNodes(menuData, node.key) || []).map(item => item.key);
                await deleteMenu({id: node.id, ids: keys.join(',')});

                const menus = await fetchMenus();
                dragPageAction.setMenus(menus);
            },
        });
    }

    function handleDragStart(e, node) {
        e.stopPropagation();
        setDraggingMenu(node);
    }

    function dropAccept(node) {
        if (draggingMenu?.id === node?.id) return false;

        // 放到子级上了
        if (findNode([draggingMenu], node.key)) return false;

        return true;
    }

    function handleDragOver(e, node) {
        e.stopPropagation();
        e.preventDefault();

        if (!draggingMenu) return;

        clearDragGuide(e, node);
        const accept = dropAccept(node);

        draggingMenu.accept = accept;

        if (!accept) return;

        const ele = document.getElementById(`menu_${node.id}`);

        const {pageY, clientY} = e;
        const eleRect = ele.getBoundingClientRect();
        const documentElement = document.documentElement || document.body;
        const windowHeight = documentElement.clientHeight;
        const scrollY = documentElement.scrollTop;
        const y = pageY - scrollY || clientY;

        let {
            top: targetY,
            height: targetHeight,
        } = eleRect;

        // 获取可视范围
        if (targetY < 0) {
            targetHeight = targetHeight + targetY;
            targetY = 0;
        }
        if (targetHeight + targetY > windowHeight) targetHeight = windowHeight - targetY;

        const halfY = targetY + targetHeight / 2;
        const isTop = y < halfY;

        draggingMenu.isTop = isTop;
        ele.classList.add(isTop ? styles.dragHoverTop : styles.dragHoverBottom);
    }

    function handleDragEnd(e, node) {
        clearDragGuide(e, node);
        setDraggingMenu(null);
    }

    function handleDragLeave(e, node) {
        clearDragGuide(e, node);
    }

    function clearDragGuide(e, node) {
        const ele = document.getElementById(`menu_${node.id}`);
        ele.classList.remove(styles.dragHoverTop);
        ele.classList.remove(styles.dragHoverBottom);
    }

    function handleDrop(e, node) {
        clearDragGuide(e, node);
        if (!draggingMenu?.accept) return;
        removeNode(menuData, draggingMenu.key);

        const targetCollection = node.parentId ? findNode(menuData, node.parentKey).children : menuData;
        const index = targetCollection.findIndex(item => item.key === node.key);

        const {isTop} = draggingMenu;
        draggingMenu.parentId = node.parentId;
        if (isTop) {
            targetCollection.splice(index, 0, draggingMenu);
        } else {
            targetCollection.splice(index + 1, 0, draggingMenu);
        }

        setMenuData([...menuData]);

        updateMenus();
        setDraggingMenu(null);
    }

    async function updateMenus() {
        // 调整order
        const menus = [];
        const max = 1000;
        const loop = nodes => nodes.forEach((node, index) => {
            const order = max - index;
            node.order = order;
            menus.push({...node, order});
            if (node?.children) loop(node.children);
        });
        loop(menuData);
        return await updateMenusOrder({menus});
    }

    function renderMenus() {
        return renderNode(menuData, (node, childrenNode) => {
            const {key, text} = node;
            let title = text;
            if (isEdit && key === currentMenuKey) {
                title = (
                    <Input
                        autoFocus
                        defaultValue={text}
                        onClick={e => e.stopPropagation()}
                        onFocus={e => handleMenuFocus(e, node)}
                        onBlur={e => handleMenuBlur(e, node)}
                        onKeyDown={e => handleMenuKeyDown(e, node)}
                    />
                );
            } else {
                title = (
                    <div
                        id={`menu_${node.id}`}
                        className={styles.menuTitle}
                        draggable
                        onDragStart={e => handleDragStart(e, node)}
                        onDragOver={e => handleDragOver(e, node)}
                        onDragLeave={e => handleDragLeave(e, node)}
                        onDragEnd={e => handleDragEnd(e, node)}
                        onDrop={e => handleDrop(e, node)}
                    >
                        <div
                            className={styles.title}
                            onClick={e => handleClick(e, node)}
                        >
                            {title}
                        </div>
                        <div className={styles.tool}>
                            <DeleteOutlined
                                className={styles.icon}
                                onClick={e => handleDelete(e, node)}
                            />
                            <LinkPoint
                                source
                                node={{...node, propsToSet: {onClick: `() => dragPageAction.setCurrentMenuKey('${node.key}')`}}}
                                id={`sourceLinkPoint_${node.id}`}
                                style={{marginRight: 4}}
                            />
                        </div>
                    </div>
                );
            }
            if (childrenNode) {
                return (
                    <SubMenu key={key || title} title={title}>
                        {childrenNode}
                    </SubMenu>
                );
            }

            return (
                <Menu.Item key={key}>{title}</Menu.Item>
            );
        });
    }

    return (
        <Pane
            header={
                <div className={styles.header}>
                    <div>
                        <AppstoreOutlined/>
                        <span style={{margin: '0 4px'}}>菜单</span>
                        <Popover
                            placement="topLeft"
                            title="说明"
                            content={(
                                <div>
                                    <ul>
                                        <li>再次点击选中菜单文字，进行编辑</li>
                                        <li>编辑输入框 {isMac ? '⌘' : 'ctrl'} + Enter，添加子节点</li>
                                        <li>编辑输入框 shift + Enter，添加兄弟节点</li>
                                    </ul>
                                </div>
                            )}
                        >
                            <QuestionCircleOutlined style={{cursor: 'pointer'}}/>
                        </Popover>
                    </div>
                    <div>
                        <Tooltip placement="top" title={isAllExpanded ? '收起所有' : '展开所有'}>
                            <div
                                className={styles.tool}
                                onClick={() => {
                                    const nextKeys = isAllExpanded ? [] : allKeys;
                                    setOpenKeys(nextKeys);
                                    setIsAllExpanded(!isAllExpanded);
                                }}
                            >
                                {isAllExpanded ? <ShrinkOutlined/> : <ArrowsAltOutlined/>}
                            </div>
                        </Tooltip>
                    </div>
                </div>
            }
        >
            <div className={styles.root}>
                <Menu
                    onClick={({key}) => dragPageAction.setCurrentMenuKey(key)}
                    style={{width: '100%'}}
                    selectedKeys={[currentMenuKey]}
                    openKeys={openKeys}
                    onOpenChange={openKeys => setOpenKeys(openKeys)}
                    mode="inline"
                >
                    {renderMenus()}
                </Menu>
            </div>
        </Pane>
    );
});
