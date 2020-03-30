import {getTopNodeByNode} from 'src/library/utils/tree-utils';
import {uniqueArray} from 'src/library/utils';
import {getMenuTreeDataAndPermissions, getSelectedMenuByPath} from '../commons';
import getMenus from "src/menus";

export default {
    initialState: {
        loading: false,         // 请求菜单loading
        openKeys: [],           // 当前展开菜单keys
        selectedMenu: null,     // 当前选中菜单
        topMenu: [],            // 当前选中菜单的顶级菜单
        keepOtherOpen: false,   // 点击菜单进入页面时，保持其他菜单打开状态
        menus: [],              // 菜单数据，树状结构
        mostUsedMenus: [],      // 最常用菜单，使用此时usedTimes降序排列
        plainMenus: [],         // 菜单数据，扁平化
    },
    syncStorage: {
        openKeys: true,
        selectedMenu: true,
        topMenu: true,
        keepOtherOpen: true,
        mostUsedMenus: true,
    },

    /**
     * 获取系统菜单
     */
    getMenus: {
        payload: ({params} = {}) => getMenus(params.userId),
        reducer: {
            resolve: (state, {payload: menus}) => {
                // 重新获取菜单之后，过滤mostUsedMenus，防止脏数据
                const mostUsedMenus = menus.filter(item => state.mostUsedMenus.find(it => it.key === item.key));
                const {menuTreeData} = getMenuTreeDataAndPermissions(menus);

                return {menus: menuTreeData, mostUsedMenus, plainMenus: menus};
            },
        },
    },

    setKeepOtherOpen: (keepOtherOpen) => ({keepOtherOpen}),
    setOpenKeys: (openKeys) => ({openKeys}),
    setMenus: (menus) => ({menus}),
    getMenuStatus: (arg, state) => {
        const path = window.location.pathname;
        const {keepOtherOpen,} = state;
        const mostUsedMenus = [...state.mostUsedMenus];

        let openKeys = [...state.openKeys];
        let selectedMenu = getSelectedMenuByPath(path, state.menus);
        let topMenu = {};

        // 如果没有匹配到，使用上一次菜单
        if (!selectedMenu && path !== '/') { // 首页除外
            selectedMenu = state.selectedMenu;
        }

        if (selectedMenu) {
            topMenu = getTopNodeByNode(state.menus, selectedMenu);
            const parentKeys = selectedMenu.parentKeys || [];

            openKeys = keepOtherOpen ? openKeys.concat(parentKeys) : [...parentKeys];

            openKeys = uniqueArray(openKeys);

            // 更新最常用菜单
            const existMostUsedMenu = mostUsedMenus.find(item => item.key === selectedMenu.key)
            if (existMostUsedMenu) {
                existMostUsedMenu.usedTimes += 1;
            } else {
                mostUsedMenus.push({...selectedMenu, usedTimes: 1});
            }

            mostUsedMenus.sort((a, b) => b.usedTimes - a.usedTimes);
        }

        return {
            topMenu,
            selectedMenu,
            openKeys,
            mostUsedMenus,
        };
    },
}

