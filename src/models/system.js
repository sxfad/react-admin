import i18n, {defaultLang} from '../i18n';
import theme from "@/theme";

// 进行本地存储同步，syncState中的同步是区分用户的，会导致未登录的页面与登录的页面有差异
const getItem = (key) => window.localStorage.getItem(key);
const setItem = (key, value) => window.localStorage.setItem(key, value);

const primaryColor = getItem('primaryColor') || theme['@primary-color'];

export default {
    initialState: {
        loading: false,             // 全局loading
        loginUser: void 0,          // 当前登录用户
        permissions: [],            // 当前登录用户权限
        local: defaultLang.local,   // 默认语言
        i18n: defaultLang.i18n,     // 默认语言集
        autoLocal: true,            // 是否根据浏览器自动获取语言，如果false，将默认简体中文
        primaryColor,               // 主题主颜色
        tabs: [],                   // 所有的tab配置 {path, text, icon, component, active, scrollTop}
        keepPage: true,             // 页面切换回去之后，保持内容，通过显示隐藏div实现，不知道会有什么坑！！！性能？各个互相干扰？
        smallFrame: false,           // 手机上等小屏幕布局
    },

    syncStorage: {
        keepPage: true,
        tabs: [{path: true, text: true, icon: true, active: true, scrollTop: true}],
    },

    setTabs: (tabs) => ({tabs}),
    setKeepPage: keepPage => ({keepPage}),

    setCurrentTabTitle: (title, state) => {
        const tabs = [...state.tabs];
        const tab = tabs.find(item => item.active);

        if (tab) tab.text = title;

        return {tabs}
    },

    refreshTab: (targetPath, state) => {
        const {tabs} = state;

        // 将tab对应的组件清空即可 KeepAuthRoute.jsx 中会进行判断，从新赋值一个新的组件，相当于刷新
        const tab = tabs.find(item => item.path === targetPath);
        tab.component = null;

        return {tabs: [...tabs]};
    },

    refreshAllTab: (arg, state) => {
        const tabs = state.tabs.map(item => ({...item, component: null}));

        return {tabs};
    },

    closeCurrentTab: (arg, state) => {
        const tabs = [...state.tabs];
        const tab = tabs.find(item => item.active);
        if (tab) return closeTabByPath(tab.path, tabs);
    },

    closeTab: (targetPath, state) => {
        const tabs = [...state.tabs];
        return closeTabByPath(targetPath, tabs);
    },

    closeOtherTabs: (targetPath, state) => {
        const closeOthersTab = state.tabs.find(item => item.path === targetPath);

        if (closeOthersTab) {
            closeOthersTab.nextActive = true;

            return {tabs: [closeOthersTab]};
        }
    },

    closeAllTabs: () => {
        return {tabs: [{path: '/', nextActive: true}]};
    },

    closeLeftTabs: (targetPath, state) => {
        const tabs = [...state.tabs];
        let closeLeftTabIndex = 0;
        const closeLeftTab = tabs.find((item, index) => {
            if (item.path === targetPath) {
                closeLeftTabIndex = index;
                return true;
            }
            return false;
        });

        if (closeLeftTab) {
            const newTabs = tabs.slice(closeLeftTabIndex);
            closeLeftTab.nextActive = true;

            return {tabs: newTabs}
        }
    },

    closeRightTabs: (targetPath, state) => {
        const tabs = [...state.tabs];
        let closeRightIndex = 0;
        const closeRightTab = tabs.find((item, index) => {
            if (item.path === targetPath) {
                closeRightIndex = index;
                return true;
            }
            return false;
        });

        if (closeRightTab) {
            const newTabs = tabs.slice(0, closeRightIndex + 1);
            closeRightTab.nextActive = true;

            return {tabs: newTabs};
        }
    },

    /**
     * 设置主题颜色
     * @param primaryColor
     * @returns {{primaryColor: *}}
     */
    setPrimaryColor: (primaryColor) => {
        setItem('primaryColor', primaryColor);

        return {primaryColor};
    },

    /**
     * 设置语言
     * @param local
     * @returns {{local: *, i18n: {application, ajaxTip, menu, login, setting}}}
     */
    setLocal: (local) => {
        const localI18n = i18n.find(item => item.local === local).i18n;

        setItem('system-local', local);

        return {local: local, i18n: localI18n}
    },

    /**
     * 设置当前用户
     * @param loginUser
     * @returns {{loginUser: *}}
     */
    setLoginUser: (loginUser) => ({loginUser}),

    /**
     * 设置当前用户权限
     * @param permissions
     * @returns {{permissions: *}}
     */
    setPermissions: (permissions) => ({permissions}),

    /**
     * 显示全局loading
     * @returns {{loading: boolean}}
     */
    showLoading: () => ({loading: true}),

    /**
     * 隐藏全局loading
     * @returns {{loading: boolean}}
     */
    hideLoading: () => ({loading: false}),
}


function closeTabByPath(targetPath, tabs) {
    let closeTabIndex = 0;

    const tab = tabs.find((item, index) => {
        if (item.path === targetPath) {
            closeTabIndex = index;
            return true;
        }
        return false;
    });

    if (tab) {
        // 关闭的是当前标签
        if (tab.active) {
            const removeTabPath = tab.path;
            const currentIndex = tabs.findIndex(item => item.path === removeTabPath);
            let nextActiveIndex = -1;

            if (removeTabPath.indexOf('/_/') !== -1) {
                nextActiveIndex = tabs.findIndex(item => item.path === removeTabPath.split('/_/')[0]);
            }

            if (nextActiveIndex === -1) {
                nextActiveIndex = 0;
                if (currentIndex === tabs.length - 1) {
                    // 当前标签已经是最后一个了，删除后选中上一个
                    nextActiveIndex = currentIndex - 1;
                } else {
                    // 当前tab标签后面还有标签，删除后选中下一个标签
                    nextActiveIndex = currentIndex + 1;
                }
            }

            if (tabs[nextActiveIndex]) {
                tabs[nextActiveIndex].nextActive = true;
            }
        }

        tabs.splice(closeTabIndex, 1);

        // 关闭的是最后一个，默认打开首页
        if (!tabs.length) return {tabs: [{path: '/', nextActive: true}]};

        return {tabs: [...tabs]};
    }
}
